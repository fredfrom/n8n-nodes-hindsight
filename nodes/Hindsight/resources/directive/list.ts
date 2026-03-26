import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['directive'], operation: ['list'] };

export const directiveListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list directives from',
		displayOptions: { show: displayFor },
	},
];
