import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['document'], operation: ['updateTags'] };

export const documentUpdateTagsFields: INodeProperties[] = [
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
		description: 'ID of the document to update tags for',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated list of tags to set on the document',
		displayOptions: { show: displayFor },
	},
];
