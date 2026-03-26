import type { INodeProperties } from 'n8n-workflow';
import { bankCreateOrUpdateFields } from './createOrUpdate';
import { bankDeleteFields } from './delete';
import { bankGetProfileFields } from './getProfile';
import { bankGetStatsFields } from './getStats';
import { bankListFields } from './list';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['bank'],
		},
	},
	options: [
		{
			name: 'Create or Update',
			value: 'createOrUpdate',
			description: 'Create a new bank or update an existing one',
			action: 'Create or update a bank',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a bank and all its data',
			action: 'Delete a bank',
		},
		{
			name: 'Get Profile',
			value: 'getProfile',
			description: 'Get the profile of a bank',
			action: 'Get a bank profile',
		},
		{
			name: 'Get Stats',
			value: 'getStats',
			description: 'Get statistics for a bank',
			action: 'Get bank statistics',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List all banks',
			action: 'List all banks',
		},
	],
	default: 'list',
};

export const bankDescription: INodeProperties[] = [
	operations,
	...bankCreateOrUpdateFields,
	...bankDeleteFields,
	...bankGetProfileFields,
	...bankGetStatsFields,
	...bankListFields,
];
