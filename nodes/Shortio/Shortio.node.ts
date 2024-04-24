import {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { resources } from './Resources';
import { linkFields, linkOperations } from './Descriptions/LinkDescription';

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

}
