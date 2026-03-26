import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['recall'] };

export const memoryRecallFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to search memories in',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		description: 'Natural language search query',
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
				default: 'mid',
				description: 'Retrieval depth -- higher budget searches more thoroughly',
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
				displayName: 'Include Chunks',
				name: 'includeChunks',
				type: 'boolean',
				default: false,
				description: 'Whether to include raw source chunks in results',
			},
			{
				displayName: 'Include Entities',
				name: 'includeEntities',
				type: 'boolean',
				default: true,
				description:
					'Whether to include entity observations in results (default: enabled with 500 token limit)',
			},
			{
				displayName: 'Include Source Facts',
				name: 'includeSourceFacts',
				type: 'boolean',
				default: false,
				description: 'Whether to include source facts for observation-type results',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 4096,
				description: 'Maximum tokens for returned facts',
			},
			{
				displayName: 'Query Timestamp',
				name: 'queryTimestamp',
				type: 'string',
				default: '',
				description:
					'ISO 8601 timestamp to anchor relative temporal expressions (e.g., "yesterday")',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags to filter memories by',
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
			{
				displayName: 'Trace',
				name: 'trace',
				type: 'boolean',
				default: false,
				description: 'Whether to enable debug trace data in the response',
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'multiOptions',
				default: [],
				description:
					'Memory types to include in results. Defaults to world and experience if empty.',
				options: [
					{
						name: 'World',
						value: 'world',
					},
					{
						name: 'Experience',
						value: 'experience',
					},
					{
						name: 'Observation',
						value: 'observation',
					},
				],
			},
		],
	},
];
