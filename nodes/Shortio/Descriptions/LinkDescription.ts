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


export const linkFields: INodeProperties[] = [

	// ------------------------------------------------------------------
	// ---------------------- GET LINK LIST FIELDS ----------------------
	// ------------------------------------------------------------------

	{
		displayName: 'Domain ID',
		name: 'domainId',
		description: "The ID of the domain used in the short links",
		type: 'string',
		required: true,
		default: '',
		placeholder: "527167",
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'getLinkList'
				]
			}
		},
	},
	{
		displayName: 'Results To Return',
		name: 'resultsToReturn',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
			numberStepSize: 1,
		},
		default: 50,
		description: 'The number of domains that will be returned',
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'getLinkList'
				]
			}
		},

	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'getLinkList'
				]
			}
		},
		options: [
			{
				displayName: 'Before Date',
				name: 'beforeDate',
				type: 'dateTime',
				default: '',
				description: 'Will only return links that were created before this date',
			},
			{
				displayName: 'After Date',
				name: 'afterDate',
				type: 'dateTime',
				default: '',
				description: 'Will only return links that were created after this date',
			},
			{
				displayName: 'Date Sort Order',
				name: 'dateSortOrder',
				type: 'options',
				options: [
					{
						name: 'Descending',
						value: 'desc',
					},
					{
						name: 'Adeccending',
						value: 'asc',
					},
				],
				default: 'asc',
			}

		],
	},

	// ------------------------------------------------------------------
	// ---------------------- GET LINK INFO FIELDS ----------------------
	// ------------------------------------------------------------------

	{
		displayName: 'Domain',
		name: 'domain',
		description: "The domain without https:// or the trailing /",
		type: 'string',
		required: true,
		default: '',
		placeholder: "domain.tdl",
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'getLinkInfo'
				]
			}
		},
	},
	{
		displayName: 'Path',
		name: 'path',
		description: "The path of the link",
		type: 'string',
		required: true,
		default: '',
		placeholder: "6fzQYy",
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'getLinkInfo'
				]
			}
		},
	},




	// ------------------------------------------------------------------
	// ----------------------- CREATE LINK FIELDS -----------------------
	// ------------------------------------------------------------------

	{
		displayName: 'Domain',
		name: 'domain',
		description: "The domain without https:// or the trailing /",
		type: 'string',
		required: true,
		default: '',
		placeholder: "domain.tdl",
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'createLink'
				]
			}
		},
	},
	{
		displayName: 'Original Long URL',
		name: 'originalURL',
		type: 'string',
		required: true,
		default: '',
		placeholder: "https://iAmALongURL.com",
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'createLink'
				]
			}
		},
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: [
					'links',
				],
				operation: [
					'createLink'
				]
			}
		},
		options: [
			{
				displayName: 'Path',
				name: 'path',
				description: "The path of the link",
				type: 'string',
				default: '',
				placeholder: "6fzQYy",
			},
			{
				displayName: 'Allow Duplicates',
				name: 'allowDuplicates',
				description: "Whether you can create multiple links with the same original URL",
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Title',
				name: 'title',
				description: "Title of created URL to be shown in short.io admin panel",
				type: 'string',
				default: '',
				placeholder: "Short Link From n8n",
			},
			{
				displayName: 'Expires At (Unix Miliseconds)',
				name: 'expiresAt',
				type: 'number',
				required: true,
				typeOptions: {
					minValue: 1,
					numberStepSize: 1,
				},
				default: '',
				placeholder: '1714442044236',
				description: 'The date and time when the link will expire in unix miliseconds',
			},
			{
				displayName: 'Expired URL',
				name: 'expiredURL',
				description: "URL to redirect when the link is expired",
				type: 'string',
				default: '',
				placeholder: "https://example.com/expired",
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'iphone URL',
				name: 'iphoneURL',
				description: "If users open the URL with iPhone, they will be redirected to this URL",
				type: 'string',
				default: '',
				placeholder: "https://iAmALongURL.com",
			},
			{
				displayName: 'Android URL',
				name: 'androidURL',
				description: "If users open the URL with Android, they will be redirected to this URL",
				type: 'string',
				default: '',
				placeholder: "https://iAmALongURL.com",
			},
			{
				displayName: 'Cloaking',
				name: 'cloaking',
				description: "Whether the link will be cloaked. Cloaked links will redirect to the original URL, but will not show the original URL in the browser address bar.",
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Redirect Type',
				name: 'redirectType',
				type: 'collection',
				placeholder: 'type',
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '301',
								value: '301',
							},
							{
								name: '302',
								value: '302',
							},
							{
								name: '303',
								value: '303',
							},
							{
								name: '307',
								value: '307',
							},
							{
								name: '308',
								value: '308',
							},
						],
						default: '302',
					},
				],
			},
			{
				displayName: 'Password',
				name: 'password',
				description: "Requires Personal plan. Password to be asked when user visits a link. This password will not be stored in plain text, we will hash it with salt.",
				type: 'string',
				typeOptions: {
					password: true
				 },
				default: '',
				placeholder: "Password123!",
			},
			{
				displayName: 'Deletes At (Unix Miliseconds)',
				name: 'ttl',
				description: "The date and time when the link will delete in unix miliseconds. If not set, link will never expire. Unlike expiresAt the link will be deleted and won't be counted in account link limit. TTL can not be earlier than 1 week from the current time.",
				type: 'string',
				default: '',
				placeholder: "1714442044236",
			},
			{
				displayName: 'UTM Source',
				name: 'utmSource',
				description: "The referrer: (e.g. google, newsletter)",
				type: 'string',
				default: '',
				placeholder: "Google",
			},
			{
				displayName: 'UTM Medium',
				name: 'utmMedium',
				description: "Marketing medium: (e.g. cpc, banner, email)",
				type: 'string',
				default: '',
				placeholder: "banner_ad",
			},
			{
				displayName: 'UTM Campaign',
				name: 'utmCampaign',
				description: "Product, promo code, or slogan (e.g. spring_sale)",
				type: 'string',
				default: '',
				placeholder: "spring_sale",
			},
			{
				displayName: 'UTM Term',
				name: 'utmTerm',
				description: "Identify the paid keywords",
				type: 'string',
				default: '',
			},
			{
				displayName: 'UTM Content',
				name: 'utmContent',
				description: "Use to differentiate ads",
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'tags',
						displayName: 'Tags',
						values: [
							{
								displayName: 'Tag',
								name: 'tag',
								type: 'string',
								default: '',
							},
						],
					},
				],
			}
		],
	},




]
