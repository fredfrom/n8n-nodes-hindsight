import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['directive'], operation: ['get'] };

export const directiveGetFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the directive belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Directive ID',
		name: 'directiveId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the directive to retrieve',
		displayOptions: { show: displayFor },
	},
];
