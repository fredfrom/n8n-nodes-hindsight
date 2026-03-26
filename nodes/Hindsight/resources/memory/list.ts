import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['memory'], operation: ['list'] };

export const memoryListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list memories from',
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
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Number of results to skip for pagination',
			},
			{
				displayName: 'Search',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Text search filter',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				description: 'Filter by memory type',
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
						name: 'World',
						value: 'world',
					},
				],
			},
		],
	},
];
