// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Model } from 'objection';

import { JsonSchema } from '../types';
import connection from './connection';

Model.knex(connection);

export default class UserNotification extends Model {
	readonly id!: number
	is_read = false
	content!: string
	link: string | undefined
	user_id!: number

	static get tableName (): string {
		return 'user_notification';
	}

	static get jsonSchema (): JsonSchema {
		return {
			properties: {
				content: { type: 'string' },
				id: { type: 'integer' },
				is_read: { type: 'boolean' },
				link: { type: 'string' },
				user_id: { type: 'integer' }
			},
			required: ['user_id'],
			type: 'object'
		};
	}
}
