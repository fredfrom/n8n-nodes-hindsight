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
				],
				default: 'bank',
			},
			...bankDescription,
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
					if (operation === 'createOrUpdate') {
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
