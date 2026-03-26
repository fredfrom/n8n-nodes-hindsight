import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['directive'], operation: ['create'] };

export const directiveCreateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to create the directive in',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Human-readable name for the directive',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		default: '',
		description: 'Directive text that will be injected into prompts',
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
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the directive is active',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 0,
				description: 'Priority order — higher values are injected first',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of filter tags',
			},
		],
	},
];
