import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['clearObservations'] };

export const memoryClearObservationsFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the memory belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Memory ID',
		name: 'memoryId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the memory unit to clear observations for',
		displayOptions: { show: displayFor },
	},
];
