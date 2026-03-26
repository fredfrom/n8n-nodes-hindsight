import type { INodeProperties } from 'n8n-workflow';
import { documentDeleteFields } from './delete';
import { documentGetFields } from './get';
import { documentListFields } from './list';
import { documentUpdateTagsFields } from './updateTags';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['document'],
		},
	},
	options: [
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a document from a bank',
			action: 'Delete a document',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific document by ID',
			action: 'Get a document',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List documents in a bank',
			action: 'List documents',
		},
		{
			name: 'Update Tags',
			value: 'updateTags',
			description: 'Update the tags on a document',
			action: 'Update document tags',
		},
	],
	default: 'list',
};

export const documentDescription: INodeProperties[] = [
	operations,
	...documentDeleteFields,
	...documentGetFields,
	...documentListFields,
	...documentUpdateTagsFields,
];
