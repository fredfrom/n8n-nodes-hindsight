import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['resetConfig'] };

export const bankResetConfigFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to reset configuration for',
		displayOptions: { show: displayFor },
	},
];
