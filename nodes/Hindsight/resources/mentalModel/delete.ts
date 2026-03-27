import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['mentalModel'], operation: ['delete'] };

export const mentalModelDeleteFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the mental model belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Mental Model ID',
		name: 'mentalModelId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the mental model to delete',
		displayOptions: { show: displayFor },
	},
];
