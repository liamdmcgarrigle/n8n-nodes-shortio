import { INodeProperties } from 'n8n-workflow';

export const statisticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Get Link Statistics',
				value: 'getLinkStatistics',
				action: 'Get link statistics',
				description: 'Get detailed statistics for a specific link',
			},
			{
				name: 'Get Domain Statistics',
				value: 'getDomainStatistics',
				action: 'Get domain statistics',
				description: 'Get detailed statistics for the entire domain',
			},
		],
		default: 'getLinkStatistics',
		displayOptions: {
			show: {
				resource: ['statistics'],
			},
		},
	},
];

export const statisticsFields: INodeProperties[] = [
	// ------------------------------------------------------------------
	// ----------------- GET LINK STATISTICS FIELDS ---------------------
	// ------------------------------------------------------------------

	{
		displayName: 'Short Link Identifier',
		name: 'shortLinkId',
		type: 'resourceLocator',
		default: { mode: 'path', value: '' },
		required: true,
		modes: [
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				hint: 'the part after the url in the short link',
				placeholder: '6fzQYy',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				hint: 'Enter the ID. It is called "idString" in short.io\'s params and looks like the placeholder.',
				placeholder: 'lnk_2d8H_1mhLCB64zynbor35uZBcd',
			},
		],
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics'],
			},
		},
	},

	// ------------------------------------------------------------------
	// -------------- SHARED STATISTICS FIELDS (PERIOD) -----------------
	// ------------------------------------------------------------------

	{
		displayName: 'Period',
		name: 'period',
		type: 'options',
		required: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Today',
				value: 'today',
			},
			{
				name: 'Yesterday',
				value: 'yesterday',
			},
			{
				name: 'Last 7 Days',
				value: 'last7',
			},
			{
				name: 'Last 30 Days',
				value: 'last30',
			},
			{
				name: 'Last Month',
				value: 'lastMonth',
			},
			{
				name: 'All Time',
				value: 'total',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
		],
		default: 'last30',
		description: 'The time period for statistics',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics', 'getDomainStatistics'],
			},
		},
	},

	{
		displayName: 'The timezone from your workflow settings will be applied.',
		name: 'customDateNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics', 'getDomainStatistics'],
				period: ['custom'],
			},
		},
	},

	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Returns statistics for clicks after this date',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics', 'getDomainStatistics'],
				period: ['custom'],
			},
		},
	},

	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Returns statistics for clicks before this date',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics', 'getDomainStatistics'],
				period: ['custom'],
			},
		},
	},

	// ------------------------------------------------------------------
	// ------------------- ADDITIONAL FIELDS ----------------------------
	// ------------------------------------------------------------------

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getLinkStatistics'],
			},
		},
		options: [
			{
				displayName: 'Clicks Chart Interval',
				name: 'clicksChartInterval',
				type: 'options',
				options: [
					{
						name: 'Hour',
						value: 'hour',
					},
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Week',
						value: 'week',
					},
					{
						name: 'Month',
						value: 'month',
					},
				],
				default: 'day',
				description: 'The interval for click statistics chart data',
			},
			{
				displayName: 'Skip Top Records',
				name: 'skipTops',
				type: 'boolean',
				default: false,
				description: 'Whether to skip top records (referer, browser, country, etc.)',
			},
		],
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getDomainStatistics'],
			},
		},
		options: [
			{
				displayName: 'Clicks Chart Interval',
				name: 'clicksChartInterval',
				type: 'options',
				options: [
					{
						name: 'Hour',
						value: 'hour',
					},
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Week',
						value: 'week',
					},
					{
						name: 'Month',
						value: 'month',
					},
				],
				default: 'day',
				description: 'The interval for click statistics chart data',
			},
		],
	},
];
