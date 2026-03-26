import type { INodeProperties } from 'n8n-workflow';
import { entityGetFields } from './get';
import { entityListFields } from './list';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['entity'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Get a specific entity by ID',
			action: 'Get an entity',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List entities in a bank',
			action: 'List entities',
		},
	],
	default: 'list',
};

export const entityDescription: INodeProperties[] = [
	operations,
	...entityGetFields,
	...entityListFields,
];
