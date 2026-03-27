import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['mentalModel'], operation: ['create'] };

export const mentalModelCreateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to create the mental model in',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Human-readable name for the mental model',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Source Query',
		name: 'sourceQuery',
		type: 'string',
		required: true,
		default: '',
		description: 'Query used to generate the mental model content via reflect',
		typeOptions: { rows: 4 },
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
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'Custom alphanumeric lowercase ID (auto-generated if empty)',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 2048,
				typeOptions: { minValue: 256, maxValue: 8192 },
				description: 'Maximum token length for generated content (256-8192)',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of visibility scoping tags',
			},
			{
				displayName: 'Trigger',
				name: 'trigger',
				type: 'fixedCollection',
				default: {},
				description: 'Auto-refresh configuration for the mental model',
				options: [
					{
						displayName: 'Trigger Config',
						name: 'triggerConfig',
						values: [
							{
								displayName: 'Exclude Mental Models',
								name: 'excludeMentalModels',
								type: 'boolean',
								default: false,
								description:
									'Whether to exclude other mental models during refresh',
							},
							{
								displayName: 'Fact Types',
								name: 'factTypes',
								type: 'multiOptions',
								default: [],
								description: 'Filter which fact types are used during reflect',
								options: [
									{
										name: 'Experience',
										value: 'experience',
									},
									{
										name: 'Observation',
										value: 'observation',
									},
									{
										name: 'World',
										value: 'world',
									},
								],
							},
							{
								displayName: 'Refresh After Consolidation',
								name: 'refreshAfterConsolidation',
								type: 'boolean',
								default: false,
								description:
									'Whether to automatically refresh after consolidation',
							},
						],
					},
				],
			},
		],
	},
];
