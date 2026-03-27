import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';
import { hindsightApiRequest } from './transport';
import { bankDescription } from './resources/bank';
import { directiveDescription } from './resources/directive';
import { documentDescription } from './resources/document';
import { entityDescription } from './resources/entity';
import { memoryDescription } from './resources/memory';
import { mentalModelDescription } from './resources/mentalModel';
import { operationDescription } from './resources/operation';

export class Hindsight implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hindsight',
		name: 'hindsight',
		icon: 'file:hindsight.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Hindsight AI memory API',
		defaults: {
			name: 'Hindsight',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'hindsightApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Bank',
						value: 'bank',
					},
					{
						name: 'Directive',
						value: 'directive',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Entity',
						value: 'entity',
					},
					{
						name: 'Memory',
						value: 'memory',
					},
					{
						name: 'Mental Model',
						value: 'mentalModel',
					},
					{
						name: 'Operation',
						value: 'operation',
					},
				],
				default: 'bank',
			},
			...bankDescription,
			...directiveDescription,
			...documentDescription,
			...entityDescription,
			...memoryDescription,
			...mentalModelDescription,
			...operationDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: unknown;

				if (resource === 'bank') {
					if (operation === 'clearObservations') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/observations`,
						);
					} else if (operation === 'consolidate') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/consolidate`,
						);
					} else if (operation === 'createOrUpdate') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const body: IDataObject = {};
						if (additionalFields.name) {
							body.name = additionalFields.name;
						}
						if (additionalFields.mission) {
							body.mission = additionalFields.mission;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'PUT',
							`/v1/default/banks/${bankId}`,
							body,
						);
					} else if (operation === 'list') {
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							'/v1/default/banks',
						);
					} else if (operation === 'listTags') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const qs: Record<string, string | number | boolean | undefined> = {};
						if (additionalFields.q) {
							qs.q = additionalFields.q as string;
						}
						if (additionalFields.limit) {
							qs.limit = additionalFields.limit as number;
						}
						if (additionalFields.offset) {
							qs.offset = additionalFields.offset as number;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/tags`,
							undefined,
							qs,
						);
					} else if (operation === 'getProfile') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/profile`,
						);
					} else if (operation === 'getStats') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/stats`,
						);
					} else if (operation === 'delete') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}`,
						);
					} else if (operation === 'updateDisposition') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const skepticism = this.getNodeParameter('skepticism', i) as number;
						const literalism = this.getNodeParameter('literalism', i) as number;
						const empathy = this.getNodeParameter('empathy', i) as number;
						const body = { disposition: { skepticism, literalism, empathy } };
						responseData = await hindsightApiRequest.call(
							this,
							'PUT',
							`/v1/default/banks/${bankId}/profile`,
							body,
						);
					} else if (operation === 'getConfig') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/config`,
						);
					} else if (operation === 'updateConfig') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const updatesJson = this.getNodeParameter('updates', i) as string;
						const updates = JSON.parse(updatesJson);
						const body = { updates };
						responseData = await hindsightApiRequest.call(
							this,
							'PATCH',
							`/v1/default/banks/${bankId}/config`,
							body,
						);
					} else if (operation === 'resetConfig') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/config`,
						);
					}
				} else if (resource === 'directive') {
					if (operation === 'create') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const directiveContent = this.getNodeParameter('content', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = { name, content: directiveContent };

						if (additionalFields.priority !== undefined) {
							body.priority = additionalFields.priority;
						}
						if (additionalFields.isActive !== undefined) {
							body.is_active = additionalFields.isActive;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}

						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/directives`,
							body,
						);
					} else if (operation === 'delete') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const directiveId = this.getNodeParameter('directiveId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/directives/${directiveId}`,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const directiveId = this.getNodeParameter('directiveId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/directives/${directiveId}`,
						);
					} else if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/directives`,
						);
					} else if (operation === 'update') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const directiveId = this.getNodeParameter('directiveId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = {};

						if (additionalFields.name) {
							body.name = additionalFields.name;
						}
						if (additionalFields.content) {
							body.content = additionalFields.content;
						}
						if (additionalFields.priority !== undefined) {
							body.priority = additionalFields.priority;
						}
						if (additionalFields.isActive !== undefined) {
							body.is_active = additionalFields.isActive;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}

						responseData = await hindsightApiRequest.call(
							this,
							'PATCH',
							`/v1/default/banks/${bankId}/directives/${directiveId}`,
							body,
						);
					}
				} else if (resource === 'memory') {
					if (operation === 'clear') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const qs: Record<string, string | number | boolean | undefined> = {};
						if (additionalFields.type) {
							qs.type = additionalFields.type as string;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/memories`,
							undefined,
							qs,
						);
					} else if (operation === 'clearObservations') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const memoryId = this.getNodeParameter('memoryId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/memories/${memoryId}/observations`,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const memoryId = this.getNodeParameter('memoryId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/memories/${memoryId}`,
						);
					} else if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const qs: Record<string, string | number | boolean | undefined> = {};
						if (additionalFields.type) {
							qs.type = additionalFields.type as string;
						}
						if (additionalFields.q) {
							qs.q = additionalFields.q as string;
						}
						if (additionalFields.limit) {
							qs.limit = additionalFields.limit as number;
						}
						if (additionalFields.offset) {
							qs.offset = additionalFields.offset as number;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/memories/list`,
							undefined,
							qs,
						);
					} else if (operation === 'retain') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const content = this.getNodeParameter('content', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const item: IDataObject = { content };

						if (additionalFields.timestamp) {
							item.timestamp = additionalFields.timestamp;
						}
						if (additionalFields.context) {
							item.context = additionalFields.context;
						}
						if (additionalFields.documentId) {
							item.document_id = additionalFields.documentId;
						}
						if (additionalFields.strategy) {
							item.strategy = additionalFields.strategy;
						}
						if (additionalFields.observationScopes) {
							item.observation_scopes = additionalFields.observationScopes;
						}

						if (additionalFields.tags) {
							item.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}

						if (additionalFields.metadata) {
							const metadataObj = additionalFields.metadata as IDataObject;
							const pairs = (metadataObj.keyValuePair as IDataObject[]) || [];
							if (pairs.length > 0) {
								const metadata: Record<string, string> = {};
								for (const pair of pairs) {
									metadata[pair.key as string] = pair.value as string;
								}
								item.metadata = metadata;
							}
						}

						if (additionalFields.entities) {
							const entitiesObj = additionalFields.entities as IDataObject;
							const entityValues = (entitiesObj.entityValues as IDataObject[]) || [];
							if (entityValues.length > 0) {
								item.entities = entityValues.map((e: IDataObject) => {
									const entity: IDataObject = { text: e.text as string };
									if (e.type) entity.type = e.type;
									return entity;
								});
							}
						}

						const body: IDataObject = { items: [item] };
						if (additionalFields.async !== undefined) {
							body.async = additionalFields.async;
						}

						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/memories`,
							body,
						);
					} else if (operation === 'recall') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const query = this.getNodeParameter('query', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = { query };

						if (
							additionalFields.types &&
							(additionalFields.types as string[]).length > 0
						) {
							body.types = additionalFields.types;
						}
						if (additionalFields.budget) {
							body.budget = additionalFields.budget;
						}
						if (additionalFields.maxTokens) {
							body.max_tokens = additionalFields.maxTokens;
						}
						if (additionalFields.trace !== undefined) {
							body.trace = additionalFields.trace;
						}
						if (additionalFields.queryTimestamp) {
							body.query_timestamp = additionalFields.queryTimestamp;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}
						if (additionalFields.tagsMatch) {
							body.tags_match = additionalFields.tagsMatch;
						}

						const include: IDataObject = {};
						if (additionalFields.includeEntities === false) {
							include.entities = null;
						} else if (additionalFields.includeEntities === true) {
							include.entities = { max_tokens: 500 };
						}
						if (additionalFields.includeChunks) {
							include.chunks = { max_tokens: 500 };
						}
						if (additionalFields.includeSourceFacts) {
							include.source_facts = {
								max_tokens: 500,
								max_tokens_per_observation: 200,
							};
						}
						if (Object.keys(include).length > 0) {
							body.include = include;
						}

						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/memories/recall`,
							body,
						);
					} else if (operation === 'reflect') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const query = this.getNodeParameter('query', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = { query };

						if (additionalFields.budget) {
							body.budget = additionalFields.budget;
						}
						if (additionalFields.maxTokens) {
							body.max_tokens = additionalFields.maxTokens;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}
						if (additionalFields.tagsMatch) {
							body.tags_match = additionalFields.tagsMatch;
						}

						if (additionalFields.responseSchema) {
							try {
								body.response_schema = JSON.parse(
									additionalFields.responseSchema as string,
								);
							} catch {
								// If invalid JSON, skip -- the API will return its own error
							}
						}

						const include: IDataObject = {};
						if (additionalFields.includeFacts) {
							include.facts = {};
						}
						if (additionalFields.includeToolCalls) {
							include.tool_calls = {};
						}
						if (Object.keys(include).length > 0) {
							body.include = include;
						}

						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/reflect`,
							body,
						);
					}
				} else if (resource === 'document') {
					if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const qs: Record<string, string | number | boolean | undefined> = {};
						if (additionalFields.q) {
							qs.q = additionalFields.q as string;
						}
						if (additionalFields.tags) {
							const tagsStr = additionalFields.tags as string;
							qs.tags = tagsStr
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t)
								.join(',');
						}
						if (additionalFields.tagsMatch) {
							qs.tags_match = additionalFields.tagsMatch as string;
						}
						if (additionalFields.limit) {
							qs.limit = additionalFields.limit as number;
						}
						if (additionalFields.offset) {
							qs.offset = additionalFields.offset as number;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/documents`,
							undefined,
							qs,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/documents/${documentId}`,
						);
					} else if (operation === 'updateTags') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const documentId = this.getNodeParameter('documentId', i) as string;
						const tagsStr = this.getNodeParameter('tags', i) as string;
						const tags = tagsStr
							.split(',')
							.map((t: string) => t.trim())
							.filter((t: string) => t);
						const body = { tags };
						responseData = await hindsightApiRequest.call(
							this,
							'PATCH',
							`/v1/default/banks/${bankId}/documents/${documentId}`,
							body,
						);
					} else if (operation === 'delete') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const documentId = this.getNodeParameter('documentId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/documents/${documentId}`,
						);
					}
				} else if (resource === 'entity') {
					if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						const qs: Record<string, string | number | boolean | undefined> = {};
						if (additionalFields.limit) {
							qs.limit = additionalFields.limit as number;
						}
						if (additionalFields.offset) {
							qs.offset = additionalFields.offset as number;
						}
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/entities`,
							undefined,
							qs,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const entityId = this.getNodeParameter('entityId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/entities/${entityId}`,
						);
					}
				} else if (resource === 'operation') {
					if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/operations`,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const operationId = this.getNodeParameter('operationId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/operations/${operationId}`,
						);
					} else if (operation === 'cancel') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const operationId = this.getNodeParameter('operationId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/operations/${operationId}`,
						);
					} else if (operation === 'retry') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const operationId = this.getNodeParameter('operationId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/operations/${operationId}/retry`,
						);
					}
				} } else if (resource === 'mentalModel') {
					if (operation === 'create') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const sourceQuery = this.getNodeParameter('sourceQuery', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = { name, source_query: sourceQuery };

						if (additionalFields.id) {
							body.id = additionalFields.id;
						}
						if (additionalFields.maxTokens) {
							body.max_tokens = additionalFields.maxTokens;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}
						if (additionalFields.trigger) {
							const triggerObj = additionalFields.trigger as IDataObject;
							const config = (triggerObj.triggerConfig as IDataObject[])?.[0];
							if (config) {
								const trigger: IDataObject = {};
								if (config.refreshAfterConsolidation !== undefined) {
									trigger.refresh_after_consolidation =
										config.refreshAfterConsolidation;
								}
								if (
									config.factTypes &&
									(config.factTypes as string[]).length > 0
								) {
									trigger.fact_types = config.factTypes;
								}
								if (config.excludeMentalModels !== undefined) {
									trigger.exclude_mental_models = config.excludeMentalModels;
								}
								body.trigger = trigger;
							}
						}

						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/mental-models`,
							body,
						);
					} else if (operation === 'delete') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const mentalModelId = this.getNodeParameter('mentalModelId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'DELETE',
							`/v1/default/banks/${bankId}/mental-models/${mentalModelId}`,
						);
					} else if (operation === 'get') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const mentalModelId = this.getNodeParameter('mentalModelId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/mental-models/${mentalModelId}`,
						);
					} else if (operation === 'getHistory') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const mentalModelId = this.getNodeParameter('mentalModelId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/mental-models/${mentalModelId}/history`,
						);
					} else if (operation === 'list') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'GET',
							`/v1/default/banks/${bankId}/mental-models`,
						);
					} else if (operation === 'refresh') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const mentalModelId = this.getNodeParameter('mentalModelId', i) as string;
						responseData = await hindsightApiRequest.call(
							this,
							'POST',
							`/v1/default/banks/${bankId}/mental-models/${mentalModelId}/refresh`,
						);
					} else if (operation === 'update') {
						const bankId = this.getNodeParameter('bankId', i) as string;
						const mentalModelId = this.getNodeParameter('mentalModelId', i) as string;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;

						const body: IDataObject = {};

						if (additionalFields.name) {
							body.name = additionalFields.name;
						}
						if (additionalFields.sourceQuery) {
							body.source_query = additionalFields.sourceQuery;
						}
						if (additionalFields.maxTokens) {
							body.max_tokens = additionalFields.maxTokens;
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string)
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t);
						}
						if (additionalFields.trigger) {
							const triggerObj = additionalFields.trigger as IDataObject;
							const config = (triggerObj.triggerConfig as IDataObject[])?.[0];
							if (config) {
								const trigger: IDataObject = {};
								if (config.refreshAfterConsolidation !== undefined) {
									trigger.refresh_after_consolidation =
										config.refreshAfterConsolidation;
								}
								if (
									config.factTypes &&
									(config.factTypes as string[]).length > 0
								) {
									trigger.fact_types = config.factTypes;
								}
								if (config.excludeMentalModels !== undefined) {
									trigger.exclude_mental_models = config.excludeMentalModels;
								}
								body.trigger = trigger;
							}
						}

						responseData = await hindsightApiRequest.call(
							this,
							'PATCH',
							`/v1/default/banks/${bankId}/mental-models/${mentalModelId}`,
							body,
						);
					}
				

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						itemIndex: i,
					});
				}
			}
		}

		return [returnData];
	}
}
