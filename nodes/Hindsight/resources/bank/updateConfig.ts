import type { INodeProperties } from 'n8n-workflow';

const displayFor = { resource: ['bank'], operation: ['updateConfig'] };

export const bankUpdateConfigFields: INodeProperties[] = [
	{
		displayName: 'Bank ID',
		name: 'bankId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the bank to update configuration for',
		displayOptions: { show: displayFor },
	},
	{
		displayName: 'Updates',
		name: 'updates',
		type: 'json',
		required: true,
		default: '{}',
		typeOptions: { rows: 5 },
		description:
			'JSON object of configuration key-value overrides. See Hindsight docs for available keys (e.g. retain_chunk_size, retain_extraction_mode, enable_observations, reflect_mission, llm_model).',
		displayOptions: { show: displayFor },
	},
];
