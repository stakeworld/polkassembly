// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Profile from '../../model/Profile';
import AuthService from '../../services/auth';
import { AddProfileArgs, Context, MessageType } from '../../types';
import getTokenFromReq from '../../utils/getTokenFromReq';
import messages from '../../utils/messages';

export default async (parent: void, {
	bio,
	image
}: AddProfileArgs, ctx: Context): Promise<MessageType> => {
	const token = getTokenFromReq(ctx.req);
	const authServiceInstance = new AuthService();
	const user = await authServiceInstance.GetUser(token);

	const profile = await Profile
		.query()
		.where({
			user_id: user.id
		})
		.first();

	if (!profile) {
		await Profile
			.query()
			.allowInsert('[user_id, bio, image]')
			.insert({
				bio,
				image,
				user_id: user.id
			});
	} else {
		await Profile
			.query()
			.patch({
				bio,
				image
			})
			.findById(profile.id);
	}

	return { message: messages.PROFILE_CHANGED_SUCCESS };
};

