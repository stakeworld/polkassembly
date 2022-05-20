// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Model } from 'objection';

import { JsonSchema } from '../types';
import connection from './connection';

Model.knex(connection);

export default class Profile extends Model {
	readonly id!: number
	user_id!: number
	badges: string | undefined
	bio: string | undefined
	image: string | undefined
	title: string | undefined

	static get tableName (): string {
		return 'profile';
	}

	static get jsonSchema (): JsonSchema {
		return {
			properties: {
				badges: { type: 'string' },
				bio: { type: 'string' },
				id: { type: 'integer' },
				image: { type: 'string' },
				title: { type: 'string' },
				user_id: { type: 'integer' }
			},
			required: ['user_id'],
			type: 'object'
		};
	}
}

