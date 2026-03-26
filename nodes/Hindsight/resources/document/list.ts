import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['document'], operation: ['list'] };

export const documentListFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list documents from',
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
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search query to filter documents',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to filter by',
			},
			{
				displayName: 'Tags Match',
				name: 'tagsMatch',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'All', value: 'all' },
					{ name: 'Any Strict', value: 'any_strict' },
					{ name: 'All Strict', value: 'all_strict' },
				],
				default: 'any',
				description: 'How to match the provided tags',
			},
		],
	},
];
