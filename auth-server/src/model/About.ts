// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Model } from 'objection';

import { JsonSchema } from '../types';
import connection from './connection';

Model.knex(connection);

export default class About extends Model {
	readonly id!: number
	network!: string
	address!: string
	title!: string
	description!: string
	image!: string

	static get tableName (): string {
		return 'about';
	}

	static get jsonSchema (): JsonSchema {
		return {
			properties: {
				address: { type: 'string' },
				description: { type: 'string' },
				id: { type: 'integer' },
				image: { type: 'string' },
				network: { type: 'network' },
				title: { type: 'string' }
			},
			required: ['network', 'address'],
			type: 'object'
		};
	}
}

