import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ShortioApi implements ICredentialType {
	name = 'shortioApi';

	displayName = 'Short.io API';

	genericAuth = true;

	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'value',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{$credentials.value}}',
			},
		},
	};

}
