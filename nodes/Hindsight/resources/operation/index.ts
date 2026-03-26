import type { INodeProperties } from 'n8n-workflow';
import { operationCancelFields } from './cancel';
import { operationGetFields } from './get';
import { operationListFields } from './list';
import { operationRetryFields } from './retry';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['operation'],
		},
	},
	options: [
		{
			name: 'Cancel',
			value: 'cancel',
			description: 'Cancel a pending operation',
			action: 'Cancel an operation',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific operation by ID',
			action: 'Get an operation',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List operations in a bank',
			action: 'List operations',
		},
		{
			name: 'Retry',
			value: 'retry',
			description: 'Retry a failed operation',
			action: 'Retry an operation',
		},
	],
	default: 'list',
};

export const operationDescription: INodeProperties[] = [
	operations,
	...operationCancelFields,
	...operationGetFields,
	...operationListFields,
	...operationRetryFields,
];
