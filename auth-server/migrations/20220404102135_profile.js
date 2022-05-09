// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

exports.up = function(knex) {
	return knex.schema.createTable('profile', (table) => {
		table.increments('id').primary().notNullable();
		table.integer('user_id').notNullable();
		table.text('bio');
		table.text('image');
		table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('profile');
};