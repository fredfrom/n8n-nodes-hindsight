import type { INodeProperties } from 'n8n-workflow';
import { directiveCreateFields } from './create';
import { directiveDeleteFields } from './delete';
import { directiveGetFields } from './get';
import { directiveListFields } from './list';
import { directiveUpdateFields } from './update';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['directive'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new directive in a bank',
			action: 'Create a directive',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a directive from a bank',
			action: 'Delete a directive',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific directive by ID',
			action: 'Get a directive',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List all directives in a bank',
			action: 'List all directives',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a directive in a bank',
			action: 'Update a directive',
		},
	],
	default: 'list',
};

export const directiveDescription: INodeProperties[] = [
	operations,
	...directiveCreateFields,
	...directiveDeleteFields,
	...directiveGetFields,
	...directiveListFields,
	...directiveUpdateFields,
];
