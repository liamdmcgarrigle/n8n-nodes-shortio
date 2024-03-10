import { INodeProperties } from "n8n-workflow";

export const linkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Get Link List',
				value: 'getLinkList',
				action: 'Get link list',
			},
			{
				name: 'Get Link Info',
				value: 'getLinkInfo',
				action: 'Get link info',
			},
			{
				name: 'Create Link',
				value: 'createLink',
				action: 'Create link',
			},
			{
				name: 'Update Existing Link',
				value: 'updateExistingLink',
				action: 'Update existing link',
			},
			{
				name: 'Delete Link',
				value: 'deleteLink',
				action: 'Delete link',
			},
			{
				name: 'Generate QR For Link',
				value: 'generateQrForLink',
				action: 'Generate qr for link',
			},
		],
		default: 'getLinkList',
		displayOptions: {
			show: {
				resource: [
					'links',
				]
			},
		},
	},
]


export const linkFields: INodeProperties[] = []
