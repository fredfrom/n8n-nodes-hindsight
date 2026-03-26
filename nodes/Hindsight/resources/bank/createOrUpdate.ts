import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['createOrUpdate'] };

export const bankCreateOrUpdateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to create or update',
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
				displayName: 'Mission',
				name: 'mission',
				type: 'string',
				default: '',
				description: 'Mission statement for the bank',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the bank',
			},
		],
	},
];
