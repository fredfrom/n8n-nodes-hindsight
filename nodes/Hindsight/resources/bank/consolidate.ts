import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['consolidate'] };

export const bankConsolidateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to trigger consolidation for',
		displayOptions: { show: displayFor },
	},
];
