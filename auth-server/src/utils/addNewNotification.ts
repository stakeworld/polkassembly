// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import UserNotification from '../model/UserNotification';

/**
 * Get the default address from an array of addresses, if there is any
 */

export default async (userId: number, link: string | undefined, content: string): Promise<void> => {
	await UserNotification.query()
		.allowInsert('[user_id, link, content]')
		.insert({
			content: content,
			link: link,
			user_id: userId
		});
};
