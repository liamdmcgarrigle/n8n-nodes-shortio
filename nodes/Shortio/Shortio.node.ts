import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { ShortioV1 } from './v1/ShortioV1.node';
import { ShortioV2 } from './v2/ShortioV2.node';

export class Shortio extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Short.io',
			name: 'Shortio',
			// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
			icon: 'file:shortio_logo.png',
			group: ['output'],
			subtitle: '={{ $parameter["operation"] }}',
			description: 'Short.io Node for shortening and managing links',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new ShortioV1(baseDescription),
			2: new ShortioV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
