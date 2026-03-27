import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['webhook'], operation: ['delete'] };

export const webhookDeleteFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank containing the webhook',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the webhook to delete',
		displayOptions: { show: displayFor },
	},
];
