import type {
	IHttpRequestOptions,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

/**
 * Duck-typed memory wrapper that satisfies the BaseChatMemory interface
 * expected by n8n's Agent node and LangChain's AgentExecutor.
 *
 * n8n checks for memory compatibility via duck-typing (isBaseChatMemory guard),
 * NOT instanceof. This means we only need loadMemoryVariables + saveContext methods
 * plus the standard property getters.
 *
 * Pattern proven by n8n-nodes-zep-memory-v3 community node (7000+ downloads).
 */
class HindsightMemoryWrapper {
	private executeFunctions: ISupplyDataFunctions;
	private bankId: string;
	private sessionId: string;
	private contextWindow: number;

	constructor(
		executeFunctions: ISupplyDataFunctions,
		bankId: string,
		sessionId: string,
		contextWindow: number = 10,
	) {
		this.executeFunctions = executeFunctions;
		this.bankId = bankId;
		this.sessionId = sessionId;
		this.contextWindow = contextWindow;
	}

	private async apiRequest(
		method: 'GET' | 'POST' | 'DELETE',
		path: string,
		body?: object,
	): Promise<unknown> {
		const credentials = await this.executeFunctions.getCredentials('hindsightApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
		const options: IHttpRequestOptions = {
			method,
			url: `${baseUrl}${path}`,
			json: true,
		};
		if (body && Object.keys(body).length > 0) {
			options.body = body;
		}
		return await this.executeFunctions.helpers.httpRequestWithAuthentication.call(
			this.executeFunctions,
			'hindsightApi',
			options,
		);
	}

	async loadMemoryVariables(_values: Record<string, unknown>): Promise<Record<string, unknown>> {
		const { index } = this.executeFunctions.addInputData(NodeConnectionTypes.AiMemory, [
			[{ json: { action: 'loadMemoryVariables', values: _values } }],
		]);

		try {
			const response = (await this.apiRequest(
				'POST',
				`/v1/default/banks/${this.bankId}/memories/recall`,
				{
					query: 'conversation history',
					tags: [this.sessionId],
					tags_match: 'all',
					max_tokens: 8192,
				},
			)) as { results?: Array<{ text?: string; tags?: string[] }> };

			const results = response.results ?? [];
			const chatHistory: Array<{
				role: string;
				type: string;
				content: string;
				author: string;
			}> = [];

			for (const result of results) {
				const text = result.text ?? '';
				const roleMatch = text.match(/^\[(user|assistant)\]:\s*/);
				if (roleMatch) {
					const originalRole = roleMatch[1];
					const messageText = text.slice(roleMatch[0].length);
					const isHuman = originalRole === 'user';
					chatHistory.push({
						role: isHuman ? 'human' : 'ai',
						type: isHuman ? 'human' : 'ai',
						content: messageText,
						author: isHuman ? 'user' : 'assistant',
					});
				}
			}

			// Apply context window (contextWindow = number of exchanges, each has 2 messages)
			const maxMessages = this.contextWindow * 2;
			const trimmed =
				chatHistory.length > maxMessages ? chatHistory.slice(-maxMessages) : chatHistory;

			this.executeFunctions.addOutputData(NodeConnectionTypes.AiMemory, index, [
				[{ json: { action: 'loadMemoryVariables', chatHistory: trimmed } }],
			]);

			return { chat_history: trimmed };
		} catch {
			this.executeFunctions.addOutputData(NodeConnectionTypes.AiMemory, index, [
				[{ json: { action: 'loadMemoryVariables', chatHistory: [] } }],
			]);
			return { chat_history: [] };
		}
	}

	async saveContext(
		inputValues: Record<string, unknown>,
		outputValues: Record<string, unknown>,
	): Promise<void> {
		const { index } = this.executeFunctions.addInputData(NodeConnectionTypes.AiMemory, [
			[{ json: { action: 'saveContext', input: inputValues, output: outputValues } }],
		]);

		const messages: Array<{ role: string; content: string }> = [];

		if (inputValues?.input) {
			messages.push({ role: 'user', content: String(inputValues.input) });
		}
		if (outputValues?.output) {
			messages.push({ role: 'assistant', content: String(outputValues.output) });
		}

		if (messages.length > 0) {
			const items = messages.map((msg) => ({
				content: `[${msg.role}]: ${msg.content}`,
				tags: [this.sessionId],
				context: `chat-session:${this.sessionId}`,
			}));

			await this.apiRequest('POST', `/v1/default/banks/${this.bankId}/memories`, { items });
		}

		this.executeFunctions.addOutputData(NodeConnectionTypes.AiMemory, index, [
			[{ json: { action: 'saveContext', savedMessages: messages.length } }],
		]);
	}

	async clear(): Promise<void> {
		// Hindsight does not support clearing by tag/session.
		// Full bank clear would affect all sessions, so this is a no-op.
	}

	// Required properties for LangChain/AgentExecutor compatibility
	get memoryKey(): string {
		return 'chat_history';
	}

	get returnMessages(): boolean {
		return true;
	}

	get inputKey(): string {
		return 'input';
	}

	get outputKey(): string {
		return 'output';
	}
}

export class HindsightMemory {
	description: INodeTypeDescription = {
		displayName: 'Hindsight Memory',
		name: 'hindsightMemory',
		icon: 'file:hindsight.svg',
		group: ['transform'],
		version: 1,
		description: 'Use Hindsight AI memory as chat memory for AI agents',
		defaults: {
			name: 'Hindsight Memory',
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
				displayName: 'Bank ID',
				name: 'bankId',
				type: 'string',
				required: true,
				default: '',
				description: 'The Hindsight memory bank to use for storing conversation history',
			},
			{
				displayName: 'Session ID Type',
				name: 'sessionIdType',
				type: 'options',
				options: [
					{
						name: 'From Input',
						value: 'fromInput',
						description: 'Use session ID from input data (e.g., Chat Trigger)',
					},
					{
						name: 'Custom Key',
						value: 'customKey',
						description: 'Specify a custom session key',
					},
				],
				default: 'fromInput',
				description: 'How to determine the session ID for conversation isolation',
			},
			{
				displayName: 'Session Key',
				name: 'sessionKey',
				type: 'string',
				default: '={{ $json.sessionId }}',
				displayOptions: {
					show: {
						sessionIdType: ['fromInput'],
					},
				},
				description:
					'Expression to extract session ID from input. Default works with Chat Trigger.',
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
				description: 'A fixed or expression-based session key for conversation isolation',
			},
			{
				displayName: 'Context Window Length',
				name: 'contextWindowLength',
				type: 'number',
				default: 10,
				typeOptions: {
					minValue: 1,
				},
				description:
					'Number of conversation exchanges (pairs of human + AI messages) to include in context',
			},
		],
	};

	async supplyData(
		this: ISupplyDataFunctions,
		itemIndex: number,
	): Promise<SupplyData> {
		const bankId = this.getNodeParameter('bankId', itemIndex) as string;
		const contextWindowLength = this.getNodeParameter(
			'contextWindowLength',
			itemIndex,
		) as number;

		const sessionIdType = this.getNodeParameter('sessionIdType', itemIndex) as string;
		let sessionId: string;
		if (sessionIdType === 'customKey') {
			sessionId = this.getNodeParameter('sessionKey', itemIndex) as string;
		} else {
			sessionId = this.getNodeParameter('sessionKey', itemIndex, 'default') as string;
		}

		if (!sessionId) {
			sessionId = 'default';
		}

		const memory = new HindsightMemoryWrapper(
			this,
			bankId,
			sessionId,
			contextWindowLength,
		);

		return {
			response: memory,
		};
	}
}
