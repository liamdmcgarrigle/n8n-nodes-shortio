import {
	IExecuteFunctions,
	IHttpRequestOptions
} from "n8n-workflow";


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
