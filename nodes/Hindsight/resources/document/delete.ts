import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['document'], operation: ['delete'] };

export const documentDeleteFields: INodeProperties[] = [
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
		description: 'ID of the document to delete',
		displayOptions: { show: displayFor },
	},
];
