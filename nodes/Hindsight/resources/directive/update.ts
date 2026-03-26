import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['directive'], operation: ['update'] };

export const directiveUpdateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the directive belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Directive ID',
		name: 'directiveId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the directive to update',
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
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'Directive text that will be injected into prompts',
				typeOptions: { rows: 4 },
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the directive is active',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Human-readable name for the directive',
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
