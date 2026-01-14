import {
	IExecuteFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INode,
	NodeOperationError,
} from 'n8n-workflow';
import { DomainInfo, FolderInfo, GetFoldersResponse } from './Interfaces';

/**
 * Normalize a domain string by removing protocol, www prefix, and trailing slashes
 */
export function normalizeDomain(domain: string): string {
	return domain.replace(/^(https?:\/\/)?(www\.)?/gi, '').replace(/\/+$/, '');
}

export async function getLinkInfo(
	node: IExecuteFunctions,
	baseLink: string,
	domain: string,
	path: string,
) {
	const body = {
		domain: domain,
		path: path,
	};

	const options: IHttpRequestOptions = {
		url: baseLink + '/links/expand',
		method: 'GET',
		qs: body,
	};

	return await node.helpers.httpRequestWithAuthentication.call(node, 'shortioApi', options);
}

export async function getDomainId(
	func: IExecuteFunctions,
	node: INode,
	itemIndex: number,
	baseLink: string,
	domain: string,
) {
	const options: IHttpRequestOptions = {
		url: baseLink + '/api/domains',
		method: 'GET',
	};

	const resp: DomainInfo[] = await func.helpers.httpRequestWithAuthentication.call(
		func,
		'shortioApi',
		options,
	);

	const domainInfo = resp.find((item) => item.hostname === domain);

	if (!domainInfo) {
		const description =
			'The domain in your credential could not be found on your account. Ensure your domain is set correctly in your credentials and try again.';
		throw new NodeOperationError(node, 'Domain in credentials not found', {
			description,
			itemIndex,
		});
	}

	return domainInfo.id;
}

export async function getCredsDomain(func: IExecuteFunctions, credName: string) {
	const cred = await func.getCredentials('shortioApi');
	return cred.domain;
}

/**
 * Get the domain ID from credentials for use in listSearch context (ILoadOptionsFunctions)
 */
export async function getDomainIdFromCredentials(
	func: ILoadOptionsFunctions,
	baseLink: string,
): Promise<string> {
	const creds = await func.getCredentials('shortioApi');
	const domain = normalizeDomain(creds.domain as string);

	const options: IHttpRequestOptions = {
		url: baseLink + '/api/domains',
		method: 'GET',
	};

	const resp: DomainInfo[] = await func.helpers.httpRequestWithAuthentication.call(
		func,
		'shortioApi',
		options,
	);

	const domainInfo = resp.find((item) => item.hostname === domain);

	if (!domainInfo) {
		throw new Error(
			'The domain in your credential could not be found on your account. Ensure your domain is set correctly in your credentials and try again.',
		);
	}

	return domainInfo.id;
}

/**
 * Fetch folders for a domain
 */
export async function getFolders(
	func: ILoadOptionsFunctions,
	domainId: string,
): Promise<FolderInfo[]> {
	const options: IHttpRequestOptions = {
		url: `https://api.short.io/links/folders/${domainId}`,
		method: 'GET',
	};

	const response: GetFoldersResponse = await func.helpers.httpRequestWithAuthentication.call(
		func,
		'shortioApi',
		options,
	);

	return response.linkFolders;
}
