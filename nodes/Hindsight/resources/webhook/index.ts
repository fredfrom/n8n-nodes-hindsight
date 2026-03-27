import type { INodeProperties } from 'n8n-workflow';
import { webhookCreateFields } from './create';
import { webhookDeleteFields } from './delete';
import { webhookListFields } from './list';
import { webhookListDeliveriesFields } from './listDeliveries';
import { webhookUpdateFields } from './update';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Register a new webhook',
			action: 'Create a webhook',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a webhook',
			action: 'Delete a webhook',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List all webhooks in a bank',
			action: 'List webhooks',
		},
		{
			name: 'List Deliveries',
			value: 'listDeliveries',
			description: 'List delivery attempts for a webhook',
			action: 'List webhook deliveries',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a webhook',
			action: 'Update a webhook',
		},
	],
	default: 'list',
};

export const webhookDescription: INodeProperties[] = [
	operations,
	...webhookCreateFields,
	...webhookDeleteFields,
	...webhookListFields,
	...webhookListDeliveriesFields,
	...webhookUpdateFields,
];
