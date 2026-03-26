import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['retain'] };

export const memoryRetainFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to store the memory in',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		description: 'Text content to analyze and store as a memory',
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
				displayName: 'Async',
				name: 'async',
				type: 'boolean',
				default: false,
				description: 'Whether to process the memory asynchronously in the background',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				default: '',
				description: 'Source or situation label (e.g., "team meeting", "slack channel")',
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				description: 'Caller-supplied document ID for upsert idempotency',
			},
			{
				displayName: 'Entities',
				name: 'entities',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				description: 'Guaranteed entities to associate with this memory',
				options: [
					{
						displayName: 'Entity',
						name: 'entityValues',
						values: [
							{
								displayName: 'Text',
								name: 'text',
								type: 'string',
								default: '',
								required: true,
								description: 'Entity name or text',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'string',
								default: '',
								description: 'Entity type (e.g., PERSON, ORG, CONCEPT)',
							},
						],
					},
				],
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				description: 'Arbitrary key-value metadata pairs',
				options: [
					{
						displayName: 'Metadata',
						name: 'keyValuePair',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Metadata key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Metadata value',
							},
						],
					},
				],
			},
			{
				displayName: 'Observation Scopes',
				name: 'observationScopes',
				type: 'options',
				default: 'combined',
				description: 'Controls how observations are scoped during consolidation',
				options: [
					{
						name: 'Per Tag',
						value: 'per_tag',
					},
					{
						name: 'Combined',
						value: 'combined',
					},
					{
						name: 'All Combinations',
						value: 'all_combinations',
					},
				],
			},
			{
				displayName: 'Strategy',
				name: 'strategy',
				type: 'string',
				default: '',
				description: 'Named retain strategy override',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags for visibility scoping',
			},
			{
				displayName: 'Timestamp',
				name: 'timestamp',
				type: 'string',
				default: '',
				description:
					'ISO 8601 timestamp of when content occurred. Use "unset" for timeless content. Defaults to now if empty.',
			},
		],
	},
];
