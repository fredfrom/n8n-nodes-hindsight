import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['operation'], operation: ['list'] };

export const operationListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list operations from',
		displayOptions: { show: displayFor },
	},
];
