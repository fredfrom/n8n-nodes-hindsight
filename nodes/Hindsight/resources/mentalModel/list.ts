import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['mentalModel'], operation: ['list'] };

export const mentalModelListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list mental models from',
		displayOptions: { show: displayFor },
	},
];
