import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { resources } from './Resources';
import { linkFields, linkOperations } from './Descriptions/LinkDescription';
import { getLinkList, getLinkListResponse } from './Interfaces';
import { getLinkInfo } from './GenericFunctions';

export class Shortio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Short.io',
		name: 'Shortio',
		group: ['Marketing & Content'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Short.io Node for shortening links',
		defaults: {
			name: 'Short.io',
		},
		requestDefaults: {
			baseURL: 'https://api.short.io/api',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		credentials: [
			{
				name: 'shortioApi',
				required: true,
			},
		],
		inputs: ['main'],
		outputs: ['main'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:shortio_logo.png',
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
				default: 'links',
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					...resources
				],
			},

			...linkOperations,
			...linkFields,

			// ...domainOperations,
			// ...domainFields,

			// ...statisticsOperations,
			// ...statisticsFields,

		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let item: INodeExecutionData;
		const baseLink = "https://api.short.io";


		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				if( this.getNodeParameter('resource', 0) === 'links' ) {

				// ------------------------------------------------------------------
				// ---------------------- GET LINK LIST FIELDS ----------------------
				// ------------------------------------------------------------------
					if( this.getNodeParameter('operation', 0) === 'getLinkList' ) {

						const domainId = this.getNodeParameter('domainId', itemIndex, '') as string;
						const resultsToReturn = this.getNodeParameter('resultsToReturn', itemIndex, 50) as number;

						const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
						const beforeDate = additionalFields.beforeDate as string;
						const afterDate = additionalFields.afterDate as string;
						const dateSortOrder = additionalFields.dateSortOrder as string;

						let requestsToMake = 1;

						let body: getLinkList = {
								"domain_id": domainId,
								"limit": resultsToReturn
							};

						if(beforeDate) {
							body['beforeDate'] = beforeDate;
						}

						if(afterDate) {
							body['afterDate'] = afterDate;
						}

						if(dateSortOrder) {
							body['dateSortOrder'] = dateSortOrder;
						}

						let lastLimit = resultsToReturn;
						if(resultsToReturn > 150){
							requestsToMake = Math.ceil(resultsToReturn / 150);
							lastLimit = resultsToReturn % 150
							body.limit = 150;
						}


						let responseObject: getLinkListResponse = {
							links:[]
						};
						let response;
						for (let i = 0; i < requestsToMake; i++) {

							if( i + 1 === requestsToMake && requestsToMake > 1){
								body.limit = lastLimit;
							}

							const options: IHttpRequestOptions = {
								url: baseLink + '/api/links',
								method: 'GET',
								qs: body,
							};

							response = await this.helpers.httpRequestWithAuthentication.call(
								this,
								'shortioApi',
								options,
							);
							responseObject.links?.push(...response.links);
							responseObject.count = response.count;
							responseObject.nextPageToken = response.nextPageToken;
							body.pageToken = response.nextPageToken;
					}

						item.json['shortIOResponse'] = responseObject;


					}


				// ------------------------------------------------------------------
				// --------------------- GET LINK DETAILS INFO ----------------------
				// ------------------------------------------------------------------
				if( this.getNodeParameter('operation', 0) === 'getLinkInfo' ) {

					const domain = this.getNodeParameter('domain', itemIndex, '') as string;
					const path = this.getNodeParameter('path', itemIndex, '') as string;

					const response = await getLinkInfo(this, baseLink, domain, path);

					item.json['shortIOResponse'] = response;

				}



				}






			} catch (error) {

				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}

}
