import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { resources } from '../Resources';
import { linkFields, linkOperations } from '../Descriptions/LinkDescriptionV2';
import { CreateShortLinkRequest, getLinkList, getLinkListResponse } from '../Interfaces';
import {
	getCredsDomain,
	getDomainId,
	getDomainIdFromCredentials,
	getFolders,
	getLinkInfo,
} from '../GenericFunctions';

const versionDescription: INodeTypeDescription = {
	displayName: 'Short.io',
	name: 'Shortio',
	// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
	icon: 'file:../shortio_logo.png',
	group: ['output'],
	version: 2,
	subtitle: '={{ $parameter["operation"] }}',
	description: 'Short.io Node for shortening and managing links',
	defaults: {
		name: 'Short.io',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'shortioApi',
			required: true,
		},
	],
	requestDefaults: {
		baseURL: 'https://api.short.io/api',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	},
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
			default: 'links',
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [...resources],
		},

		...linkOperations,
		...linkFields,
	],
};

export class ShortioV2 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = {
		listSearch: {
			async folderSearch(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const baseLink = 'https://api.short.io';
				const domainId = await getDomainIdFromCredentials(this, baseLink);
				const folders = await getFolders(this, domainId);

				return {
					results: folders.map((folder) => ({
						name: folder.name,
						value: folder.id,
					})),
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const baseLink = 'https://api.short.io';
		const domain = ((await getCredsDomain(this, 'shortioApi')) as string)
			.replace(/^(https?:\/\/)?(www\.)?/gi, '')
			.replace(/\/+$/, '');

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				if (this.getNodeParameter('resource', 0) === 'links') {
					// ------------------------------------------------------------------
					// ---------------------- GET LINK LIST FIELDS ----------------------
					// ------------------------------------------------------------------
					if (this.getNodeParameter('operation', 0) === 'getLinkList') {
						const domainId = await getDomainId(this, this.getNode(), itemIndex, baseLink, domain);
						const resultsToReturn = this.getNodeParameter(
							'resultsToReturn',
							itemIndex,
							50,
						) as number;

						const additionalFields = this.getNodeParameter(
							'additionalFields',
							itemIndex,
						) as IDataObject;
						const beforeDate = additionalFields.beforeDate as string;
						const afterDate = additionalFields.afterDate as string;
						const dateSortOrder = additionalFields.dateSortOrder as string;

						let requestsToMake = 1;

						const body: getLinkList = {
							domain_id: domainId,
							limit: resultsToReturn,
						};

						if (beforeDate) {
							body['beforeDate'] = beforeDate;
						}

						if (afterDate) {
							body['afterDate'] = afterDate;
						}

						if (dateSortOrder) {
							body['dateSortOrder'] = dateSortOrder;
						}

						let lastLimit = resultsToReturn;
						if (resultsToReturn > 150) {
							requestsToMake = Math.ceil(resultsToReturn / 150);
							lastLimit = resultsToReturn % 150;
							body.limit = 150;
						}

						const responseObject: getLinkListResponse = {
							links: [],
						};
						let response;
						for (let i = 0; i < requestsToMake; i++) {
							if (i + 1 === requestsToMake && requestsToMake > 1) {
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

						returnData.push({
							json: responseObject as unknown as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}

					// ------------------------------------------------------------------
					// --------------------- GET LINK DETAILS INFO ----------------------
					// ------------------------------------------------------------------
					if (this.getNodeParameter('operation', 0) === 'getLinkInfo') {
						const path = this.getNodeParameter('path', itemIndex, '') as string;

						const response = await getLinkInfo(this, baseLink, domain, path);

						returnData.push({
							json: response as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}

					// ------------------------------------------------------------------
					// --------------------------- CREATE LINK --------------------------
					// ------------------------------------------------------------------
					if (this.getNodeParameter('operation', 0) === 'createLink') {
						const originalURL = this.getNodeParameter('originalURL', itemIndex, '') as string;

						const additionalFields = this.getNodeParameter(
							'additionalFields',
							itemIndex,
						) as IDataObject;
						const path = additionalFields.path as string;
						const allowDuplicates = additionalFields.allowDuplicates as boolean;
						const title = additionalFields.title as string;
						const tagsData = additionalFields.tags as { tags: { tag: string }[] } | undefined;
						const expiresAt = additionalFields.expiresAt as number;
						const expiredURL = additionalFields.expiredURL as string;
						const iphoneURL = additionalFields.iphoneURL as string;
						const androidURL = additionalFields.androidURL as string;
						const cloaking = additionalFields.cloaking as boolean;
						const redirectType = additionalFields.redirectType as string;
						const password = additionalFields.password as string;
						const ttl = additionalFields.ttl as number;
						const utmSource = additionalFields.utmSource as string;
						const utmMedium = additionalFields.utmMedium as string;
						const utmCampaign = additionalFields.utmCampaign as string;
						const utmTerm = additionalFields.utmTerm as string;
						const utmContent = additionalFields.utmContent as string;
						const folderIdData = additionalFields.folderId as
							| { mode: string; value: string }
							| undefined;

						const body: CreateShortLinkRequest = {
							domain: domain,
							originalURL: originalURL,
						};

						if (path) {
							body.path = path;
						}

						if (allowDuplicates) {
							body.allowDuplicates = allowDuplicates;
						}

						if (title) {
							body.title = title;
						}

						if (tagsData?.tags) {
							body.tags = tagsData.tags.map((t) => t.tag);
						}

						if (expiresAt) {
							body.expiresAt = expiresAt;
						}

						if (expiredURL) {
							body.expiredURL = expiredURL;
						}

						if (iphoneURL) {
							body.iphoneURL = iphoneURL;
						}

						if (androidURL) {
							body.androidURL = androidURL;
						}

						if (cloaking) {
							body.cloaking = cloaking;
						}

						if (redirectType) {
							body.redirectType = redirectType;
						}

						if (password) {
							body.password = password;
						}

						if (ttl) {
							body.ttl = ttl;
						}

						if (utmSource) {
							body.utmSource = utmSource;
						}

						if (utmMedium) {
							body.utmMedium = utmMedium;
						}

						if (utmCampaign) {
							body.utmCampaign = utmCampaign;
						}

						if (utmTerm) {
							body.utmTerm = utmTerm;
						}

						if (utmContent) {
							body.utmContent = utmContent;
						}

						if (folderIdData?.value) {
							body.folderId = folderIdData.value;
						}

						const options: IHttpRequestOptions = {
							url: baseLink + '/links',
							method: 'POST',
							body: body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'shortioApi',
							options,
						);

						returnData.push({
							json: response as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}

					// ------------------------------------------------------------------
					// --------------------------- UPDATE LINK --------------------------
					// ------------------------------------------------------------------
					if (this.getNodeParameter('operation', 0) === 'updateExistingLink') {
						let existingShortLinkId: any = this.getNodeParameter(
							'shortLinkId',
							itemIndex,
							'',
						) as string;

						if (existingShortLinkId.mode === 'path') {
							const shortLinkInfo = await getLinkInfo(
								this,
								baseLink,
								domain,
								existingShortLinkId.value,
							);
							existingShortLinkId = shortLinkInfo.idString;
						}

						const originalURL = this.getNodeParameter('originalURL', itemIndex, '') as string;

						const additionalFields = this.getNodeParameter(
							'additionalFields',
							itemIndex,
						) as IDataObject;
						const path = additionalFields.path as string;
						const allowDuplicates = additionalFields.allowDuplicates as boolean;
						const title = additionalFields.title as string;
						const tagsData = additionalFields.tags as { tags: { tag: string }[] } | undefined;
						const expiresAt = additionalFields.expiresAt as number;
						const expiredURL = additionalFields.expiredURL as string;
						const iphoneURL = additionalFields.iphoneURL as string;
						const androidURL = additionalFields.androidURL as string;
						const cloaking = additionalFields.cloaking as boolean;
						const redirectType = additionalFields.redirectType as string;
						const password = additionalFields.password as string;
						const ttl = additionalFields.ttl as number;
						const utmSource = additionalFields.utmSource as string;
						const utmMedium = additionalFields.utmMedium as string;
						const utmCampaign = additionalFields.utmCampaign as string;
						const utmTerm = additionalFields.utmTerm as string;
						const utmContent = additionalFields.utmContent as string;
						const folderIdData = additionalFields.folderId as
							| { mode: string; value: string }
							| undefined;

						const body: CreateShortLinkRequest = {
							originalURL: originalURL,
						};

						if (path) {
							body.path = path;
						}

						if (allowDuplicates) {
							body.allowDuplicates = allowDuplicates;
						}

						if (title) {
							body.title = title;
						}

						if (tagsData?.tags) {
							body.tags = tagsData.tags.map((t) => t.tag);
						}

						if (expiresAt) {
							body.expiresAt = expiresAt;
						}

						if (expiredURL) {
							body.expiredURL = expiredURL;
						}

						if (iphoneURL) {
							body.iphoneURL = iphoneURL;
						}

						if (androidURL) {
							body.androidURL = androidURL;
						}

						if (cloaking) {
							body.cloaking = cloaking;
						}

						if (redirectType) {
							body.redirectType = redirectType;
						}

						if (password) {
							body.password = password;
						}

						if (ttl) {
							body.ttl = ttl;
						}

						if (utmSource) {
							body.utmSource = utmSource;
						}

						if (utmMedium) {
							body.utmMedium = utmMedium;
						}

						if (utmCampaign) {
							body.utmCampaign = utmCampaign;
						}

						if (utmTerm) {
							body.utmTerm = utmTerm;
						}

						if (utmContent) {
							body.utmContent = utmContent;
						}

						if (folderIdData?.value) {
							body.folderId = folderIdData.value;
						}

						const options: IHttpRequestOptions = {
							url: baseLink + '/links/' + existingShortLinkId,
							method: 'POST',
							body: body,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'shortioApi',
							options,
						);

						returnData.push({
							json: response as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}

					// ------------------------------------------------------------------
					// --------------------------- DELETE LINK --------------------------
					// ------------------------------------------------------------------
					if (this.getNodeParameter('operation', 0) === 'deleteLink') {
						let existingShortLinkId: any = this.getNodeParameter(
							'shortLinkId',
							itemIndex,
							'',
						) as string;

						if (existingShortLinkId.mode === 'path') {
							const shortLinkInfo = await getLinkInfo(
								this,
								baseLink,
								domain,
								existingShortLinkId.value,
							);
							existingShortLinkId = shortLinkInfo.idString;
						}

						const options: IHttpRequestOptions = {
							url: baseLink + '/links/' + existingShortLinkId,
							method: 'DELETE',
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'shortioApi',
							options,
						);

						returnData.push({
							json: response as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}
				} // end of links resource check
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: itemIndex },
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
