import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['delete'] };

export const bankDeleteFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to delete',
		displayOptions: { show: displayFor },
	},
];
