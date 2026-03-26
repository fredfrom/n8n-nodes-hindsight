import type { INodeProperties } from 'n8n-workflow';
import { bankCreateOrUpdateFields } from './createOrUpdate';
import { bankDeleteFields } from './delete';
import { bankGetConfigFields } from './getConfig';
import { bankGetProfileFields } from './getProfile';
import { bankGetStatsFields } from './getStats';
import { bankListFields } from './list';
import { bankResetConfigFields } from './resetConfig';
import { bankUpdateConfigFields } from './updateConfig';
import { bankUpdateDispositionFields } from './updateDisposition';

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
			name: 'Get Config',
			value: 'getConfig',
			description: 'Get the resolved configuration for a bank',
			action: 'Get bank configuration',
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
		{
			name: 'Reset Config',
			value: 'resetConfig',
			description: 'Reset bank configuration to server defaults',
			action: 'Reset bank configuration',
		},
		{
			name: 'Update Config',
			value: 'updateConfig',
			description: 'Update bank configuration overrides',
			action: 'Update bank configuration',
		},
		{
			name: 'Update Disposition',
			value: 'updateDisposition',
			description: 'Update bank personality traits (skepticism, literalism, empathy)',
			action: 'Update bank disposition',
		},
	],
	default: 'list',
};

export const bankDescription: INodeProperties[] = [
	operations,
	...bankCreateOrUpdateFields,
	...bankDeleteFields,
	...bankGetConfigFields,
	...bankGetProfileFields,
	...bankGetStatsFields,
	...bankListFields,
	...bankResetConfigFields,
	...bankUpdateConfigFields,
	...bankUpdateDispositionFields,
];
