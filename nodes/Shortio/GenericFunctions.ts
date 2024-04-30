import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INode,
	NodeOperationError
} from "n8n-workflow";
import { DomainInfo } from "./Interfaces";


export async function getLinkInfo(
	node:IExecuteFunctions,
	baseLink:string,
	domain:string,
	path:string,
){

	const body = {
		"domain":domain,
		"path":path
	}

	const options: IHttpRequestOptions = {
		url: baseLink + '/links/expand',
		method: 'GET',
		qs: body,
	};

	return await node.helpers.httpRequestWithAuthentication.call(
		node,
		'shortioApi',
		options,
	);
}


export async function getDomainId(
	func:IExecuteFunctions,
	node:INode,
	itemIndex:number,
	baseLink: string,
	domain:string,
){


	const options: IHttpRequestOptions = {
		url: baseLink + '/api/domains',
		method: 'GET',
	};

	const resp: DomainInfo[] = await func.helpers.httpRequestWithAuthentication.call(
		func,
		'shortioApi',
		options,
	);

	const domainInfo = resp.find(item => item.hostname === domain)

	if (!domainInfo){
		const description = 'The domain in your credential could not be found on your account. Ensure your domain is set correctly in your credentials and try again.'
		throw new NodeOperationError(node, 'Domain in credentials not found', {
			description,
			itemIndex,
		});
	}

	return domainInfo.id
}

export async function getCredsDomain(
	func: IExecuteFunctions,
	credName: string
) {
	const cred = await func.getCredentials('shortioApi');
	return cred.domain
}
