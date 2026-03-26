import type { INodeProperties } from 'n8n-workflow';
import { memoryClearFields } from './clear';
import { memoryClearObservationsFields } from './clearObservations';
import { memoryGetFields } from './get';
import { memoryListFields } from './list';
import { memoryRecallFields } from './recall';
import { memoryReflectFields } from './reflect';
import { memoryRetainFields } from './retain';

const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['memory'],
		},
	},
	options: [
		{
			name: 'Clear',
			value: 'clear',
			description: 'Clear all memories in a bank',
			action: 'Clear memories',
		},
		{
			name: 'Clear Observations',
			value: 'clearObservations',
			description: 'Clear observations for a specific memory',
			action: 'Clear memory observations',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Get a single memory unit',
			action: 'Get a memory',
		},
		{
			name: 'List',
			value: 'list',
			description: 'List memory units in a bank',
			action: 'List memories',
		},
		{
			name: 'Recall',
			value: 'recall',
			description: 'Search and retrieve relevant memories',
			action: 'Recall memories',
		},
		{
			name: 'Reflect',
			value: 'reflect',
			description: 'Generate an AI response based on stored memories',
			action: 'Reflect on memories',
		},
		{
			name: 'Retain',
			value: 'retain',
			description: 'Store new content as a memory',
			action: 'Retain a memory',
		},
	],
	default: 'retain',
};

export const memoryDescription: INodeProperties[] = [
	operations,
	...memoryClearFields,
	...memoryClearObservationsFields,
	...memoryGetFields,
	...memoryListFields,
	...memoryRecallFields,
	...memoryReflectFields,
	...memoryRetainFields,
];
