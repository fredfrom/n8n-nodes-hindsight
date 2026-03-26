import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['operation'], operation: ['retry'] };

export const operationRetryFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the operation belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Operation ID',
		name: 'operationId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the operation to retry',
		displayOptions: { show: displayFor },
	},
];
