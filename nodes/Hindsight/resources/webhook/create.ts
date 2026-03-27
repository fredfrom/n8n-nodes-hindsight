import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['webhook'], operation: ['create'] };

export const webhookCreateFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to register the webhook in',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'Delivery endpoint URL for webhook events',
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
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
			{
				displayName: 'Event Types',
				name: 'eventTypes',
				type: 'multiOptions',
				options: [
					{
						name: 'Consolidation Completed',
						value: 'consolidation.completed',
					},
					{
						name: 'Retain Completed',
						value: 'retain.completed',
					},
				],
				default: [],
				description: 'Event types to deliver (defaults to consolidation.completed if empty)',
			},
			{
				displayName: 'HTTP Config',
				name: 'httpConfig',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add HTTP Config',
				typeOptions: { multipleValues: false },
				options: [
					{
						displayName: 'Config',
						name: 'config',
						values: [
							{
								displayName: 'Method',
								name: 'method',
								type: 'options',
								options: [
									{ name: 'GET', value: 'GET' },
									{ name: 'POST', value: 'POST' },
								],
								default: 'POST',
								description: 'HTTP method for webhook delivery',
							},
							{
								displayName: 'Timeout (Seconds)',
								name: 'timeoutSeconds',
								type: 'number',
								typeOptions: { minValue: 1 },
								default: 30,
								description: 'Request timeout in seconds',
							},
							{
								displayName: 'Headers',
								name: 'headers',
								type: 'fixedCollection',
								default: {},
								typeOptions: { multipleValues: true },
								options: [
									{
										displayName: 'Header',
										name: 'headerValues',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
											},
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
											},
										],
									},
								],
								description: 'Custom headers to include in webhook delivery',
							},
							{
								displayName: 'Query Parameters',
								name: 'params',
								type: 'fixedCollection',
								default: {},
								typeOptions: { multipleValues: true },
								options: [
									{
										displayName: 'Parameter',
										name: 'paramValues',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
											},
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
											},
										],
									},
								],
								description: 'Custom query parameters to include in webhook delivery',
							},
						],
					},
				],
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'HMAC-SHA256 signing secret for verifying webhook payloads',
			},
		],
	},
];
