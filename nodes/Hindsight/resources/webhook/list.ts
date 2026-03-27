import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['webhook'], operation: ['list'] };

export const webhookListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list webhooks from',
		displayOptions: { show: displayFor },
	},
];
