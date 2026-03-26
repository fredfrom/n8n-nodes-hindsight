import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['getProfile'] };

export const bankGetProfileFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to get the profile for',
		displayOptions: { show: displayFor },
	},
];
