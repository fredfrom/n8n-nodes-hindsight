import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['getConfig'] };

export const bankGetConfigFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to get configuration for',
		displayOptions: { show: displayFor },
	},
];
