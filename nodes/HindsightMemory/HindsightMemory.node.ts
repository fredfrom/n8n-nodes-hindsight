import {
	NodeConnectionTypes,
	type IHttpRequestOptions,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';
import {
	BaseChatHistory,
	WindowedChatMemory,
	supplyMemory,
} from '@n8n/ai-node-sdk';
import type { Message } from '@n8n/ai-node-sdk';

class HindsightChatHistory extends BaseChatHistory {
	constructor(
		private readonly context: ISupplyDataFunctions,
		private readonly bankId: string,
		private readonly sessionId: string,
	) {
		super();
	}

	private async apiRequest(
		method: 'GET' | 'POST' | 'DELETE',
		path: string,
		body?: object,
	): Promise<unknown> {
		const credentials = await this.context.getCredentials('hindsightApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
		const options: IHttpRequestOptions = {
			method,
			url: `${baseUrl}${path}`,
			json: true,
		};
		if (body && Object.keys(body).length > 0) {
			options.body = body;
		}
		return await this.context.helpers.httpRequestWithAuthentication.call(
			this.context,
			'hindsightApi',
			options,
		);
	}

	async getMessages(): Promise<Message[]> {
		const response = (await this.apiRequest(
			'POST',
			`/v1/default/banks/${this.bankId}/memories/recall`,
			{
				query: 'conversation history',
				tags: [this.sessionId],
				tags_match: 'all',
				max_tokens: 8192,
			},
		)) as { results?: Array<{ content?: string; type?: string }> };

		const results = response.results ?? [];
		const messages: Message[] = [];

		for (const result of results) {
			const content = result.content ?? '';

			// Parse role prefix from stored messages: "[user]: ..." or "[assistant]: ..."
			const roleMatch = content.match(/^\[(user|assistant|system)\]:\s*/);
			if (roleMatch) {
				const role = roleMatch[1] as Message['role'];
				const text = content.slice(roleMatch[0].length);
				messages.push({
					role,
					content: [{ type: 'text', text }],
				});
			} else {
				// No role prefix -- treat as assistant message
				messages.push({
					role: 'assistant',
					content: [{ type: 'text', text: content }],
				});
			}
		}

		return messages;
	}

	async addMessage(message: Message): Promise<void> {
		const textContent = message.content
			.filter((c): c is { type: 'text'; text: string } => c.type === 'text')
			.map((c) => c.text)
			.join('\n');

		if (!textContent) return;

		await this.apiRequest(
			'POST',
			`/v1/default/banks/${this.bankId}/memories`,
			{
				items: [
					{
						content: `[${message.role}]: ${textContent}`,
						tags: [this.sessionId],
						context: `chat-session:${this.sessionId}`,
					},
				],
			},
		);
	}

	async clear(): Promise<void> {
		// Hindsight's clear API clears all memories in a bank, not per-session.
		// Only clear if the user explicitly wants to wipe the bank.
		// For session-scoped clearing, this is a no-op since Hindsight
		// does not support clearing by tag filter.
	}
}

export class HindsightMemory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hindsight Memory',
		name: 'hindsightMemory',
		icon: 'file:hindsight.svg',
		group: ['transform'],
		version: 1,
		description: 'Use Hindsight AI memory banks with n8n AI agents for persistent conversation history',
		defaults: {
			name: 'Hindsight Memory',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Memory'],
				Memory: ['Other memories'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://hindsight.vectorize.io',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiMemory],
		outputNames: ['Memory'],
		credentials: [
			{
				name: 'hindsightApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Connect this node to the memory input of an AI Agent node',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Bank ID',
				name: 'bankId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the Hindsight bank to use for memory storage',
			},
			{
				displayName: 'Session ID Type',
				name: 'sessionIdType',
				type: 'options',
				options: [
					{
						name: 'From Chat Trigger (Default)',
						value: 'fromInput',
						description: 'Uses the session ID from the connected Chat Trigger node',
					},
					{
						name: 'Custom Key',
						value: 'customKey',
						description: 'Define a custom session key',
					},
				],
				default: 'fromInput',
			},
			{
				displayName: 'Session Key',
				name: 'sessionKey',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						sessionIdType: ['customKey'],
					},
				},
				description: 'Custom key to use for session identification. Used as a tag to scope memories to this conversation.',
			},
			{
				displayName: 'Context Window Length',
				name: 'contextWindowLength',
				type: 'number',
				default: 10,
				typeOptions: {
					minValue: 1,
				},
				description: 'Maximum number of past message pairs to include in the context window',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const bankId = this.getNodeParameter('bankId', itemIndex) as string;
		const contextWindowLength = this.getNodeParameter('contextWindowLength', itemIndex) as number;

		const sessionIdType = this.getNodeParameter('sessionIdType', itemIndex) as string;
		let sessionId: string;
		if (sessionIdType === 'customKey') {
			sessionId = this.getNodeParameter('sessionKey', itemIndex) as string;
		} else {
			// Try to get session ID from the connected Chat Trigger
			sessionId = this.getNodeParameter('sessionKey', itemIndex, 'default') as string;
		}

		if (!sessionId) {
			sessionId = 'default';
		}

		const chatHistory = new HindsightChatHistory(this, bankId, sessionId);
		const memory = new WindowedChatMemory(chatHistory, {
			windowSize: contextWindowLength,
		});

		return supplyMemory(this, memory);
	}
}
