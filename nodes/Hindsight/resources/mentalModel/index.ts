import type { INodeProperties } from 'n8n-workflow';
import { mentalModelCreateFields } from './create';
import { mentalModelDeleteFields } from './delete';
import { mentalModelGetFields } from './get';
import { mentalModelGetHistoryFields } from './getHistory';
import { mentalModelListFields } from './list';
import { mentalModelRefreshFields } from './refresh';
import { mentalModelUpdateFields } from './update';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['mentalModel'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new mental model in a bank',
			action: 'Create a mental model',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a mental model from a bank',
			action: 'Delete a mental model',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific mental model by ID',
			action: 'Get a mental model',
		},
		{
			name: 'Get History',
			value: 'getHistory',
			description: 'Get the content history of a mental model',
			action: 'Get mental model history',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List all mental models in a bank',
			action: 'List all mental models',
		},
		{
			name: 'Refresh',
			value: 'refresh',
			description: 'Re-run the source query to regenerate mental model content',
			action: 'Refresh a mental model',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update a mental model in a bank',
			action: 'Update a mental model',
		},
	],
	default: 'list',
};

export const mentalModelDescription: INodeProperties[] = [
	operations,
	...mentalModelCreateFields,
	...mentalModelDeleteFields,
	...mentalModelGetFields,
	...mentalModelGetHistoryFields,
	...mentalModelListFields,
	...mentalModelRefreshFields,
	...mentalModelUpdateFields,
];
