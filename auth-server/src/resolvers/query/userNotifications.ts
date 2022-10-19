// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import UserNotification from '../../model/UserNotification';
import AuthService from '../../services/auth';
import { Context, UserNotifications } from '../../types';
import getTokenFromReq from '../../utils/getTokenFromReq';

export default async (parent: void, ctx: Context): Promise<UserNotifications[] | null> => {
	const token = getTokenFromReq(ctx.req);
	const authServiceInstance = new AuthService();

	const user = await authServiceInstance.GetUser(token);

	const notifications = await UserNotification
		.query()
		.where({
			is_read: false,
			user_id: user.id
		});

	if (!notifications) {
		return null;
	}

	return notifications;
};
