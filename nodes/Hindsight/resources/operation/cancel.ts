import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['operation'], operation: ['cancel'] };

export const operationCancelFields: INodeProperties[] = [
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
		description: 'ID of the operation to cancel',
		displayOptions: { show: displayFor },
	},
];
