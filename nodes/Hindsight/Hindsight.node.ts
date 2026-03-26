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
import { memoryDescription } from './resources/memory';

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
						name: 'Memory',
						value: 'memory',
					},
				],
				default: 'bank',
			},
			...bankDescription,
			...directiveDescription,
			...memoryDescription,
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
