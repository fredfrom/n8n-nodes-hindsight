import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['getStats'] };

export const bankGetStatsFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to get statistics for',
		displayOptions: { show: displayFor },
	},
];
