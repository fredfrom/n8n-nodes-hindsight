import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['clearObservations'] };

export const bankClearObservationsFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to clear all observations for',
		displayOptions: { show: displayFor },
	},
];
