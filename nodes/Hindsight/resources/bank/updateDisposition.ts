import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['updateDisposition'] };

export const bankUpdateDispositionFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to update disposition for',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Skepticism',
		name: 'skepticism',
		type: 'number',
		required: true,
		default: 3,
		typeOptions: { minValue: 1, maxValue: 5 },
		description: 'Skepticism level (1=trusting, 5=skeptical)',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Literalism',
		name: 'literalism',
		type: 'number',
		required: true,
		default: 3,
		typeOptions: { minValue: 1, maxValue: 5 },
		description: 'Literalism level (1=flexible, 5=literal)',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Empathy',
		name: 'empathy',
		type: 'number',
		required: true,
		default: 3,
		typeOptions: { minValue: 1, maxValue: 5 },
		description: 'Empathy level (1=empathetic, 5=detached)',
		displayOptions: { show: displayFor },
	},
];
