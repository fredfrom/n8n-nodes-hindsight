import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['entity'], operation: ['get'] };

export const entityGetFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank the entity belongs to',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the entity to retrieve',
		displayOptions: { show: displayFor },
	},
];
