import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['reflect'] };

export const memoryReflectFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to reflect on',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		description: 'Question or prompt to reflect on using stored memories',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: displayFor },
		options: [
			{
				displayName: 'Budget',
				name: 'budget',
				type: 'options',
				default: 'low',
				description: 'Search thoroughness before generating response',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Mid',
						value: 'mid',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
			},
			{
				displayName: 'Include Facts',
				name: 'includeFacts',
				type: 'boolean',
				default: false,
				description:
					'Whether to include evidence (memories, mental models, directives) used to generate the response',
			},
			{
				displayName: 'Include Tool Calls',
				name: 'includeToolCalls',
				type: 'boolean',
				default: false,
				description: 'Whether to include execution trace of tool and LLM calls',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 4096,
				description: 'Maximum tokens for the generated response',
			},
			{
				displayName: 'Response Schema',
				name: 'responseSchema',
				type: 'json',
				default: '',
				description:
					'JSON Schema for structured output. When provided, the response will conform to this schema.',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags to filter accessible memories',
			},
			{
				displayName: 'Tags Match',
				name: 'tagsMatch',
				type: 'options',
				default: 'any',
				description: 'How to match multiple tags',
				options: [
					{
						name: 'Any',
						value: 'any',
					},
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Any Strict',
						value: 'any_strict',
					},
					{
						name: 'All Strict',
						value: 'all_strict',
					},
				],
			},
		],
	},
];
