import type { INodeProperties } from 'n8n-workflow';
import { memoryRetainFields } from './retain';
import { memoryRecallFields } from './recall';
import { memoryReflectFields } from './reflect';

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
	...memoryRetainFields,
	...memoryRecallFields,
	...memoryReflectFields,
];
