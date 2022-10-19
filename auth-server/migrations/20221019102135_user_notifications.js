// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
exports.up = (knex) => {
	return knex.schema.createTable('user_notification', (table) => {
		table.increments('id').primary();
		table.string('link').nullable();
		table.string('content').notNullable();
		table.boolean('is_read').notNullable().defaultTo(false);
        table.integer('user_id').notNullable();
		table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
	});
};

exports.down = (knex) => {
	return knex.schema.dropTable('user_notification');
};
