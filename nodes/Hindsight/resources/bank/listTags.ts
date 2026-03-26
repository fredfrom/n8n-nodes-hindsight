import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['listTags'] };

export const bankListTagsFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to list tags for',
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
				description: 'Substring search filter for tags',
			},
		],
	},
];
