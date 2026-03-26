import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['document'], operation: ['get'] };

export const documentGetFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the document belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the document to retrieve',
		displayOptions: { show: displayFor },
	},
];
