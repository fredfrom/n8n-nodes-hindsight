import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['clear'] };

export const memoryClearFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to clear memories from',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: displayFor },
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				description: 'Only clear memories of this type (leave empty to clear all)',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Experience',
						value: 'experience',
					},
					{
						name: 'Observation',
						value: 'observation',
					},
					{
						name: 'Opinion',
						value: 'opinion',
					},
					{
						name: 'World',
						value: 'world',
					},
				],
			},
		],
	},
];
