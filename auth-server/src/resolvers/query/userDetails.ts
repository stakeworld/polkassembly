// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AuthenticationError } from 'apollo-server';

import Profile from '../../model/Profile';
import User from '../../model/User';
import { GetProfileArgs, ProfileDetails } from '../../types';
import messages from '../../utils/messages';

export default async (parent: void, { user_id }: GetProfileArgs): Promise<ProfileDetails | null> => {
	const user = await User
		.query()
		.where({
			id: user_id
		})
		.first();

	if (!user) {
		throw new AuthenticationError(messages.USER_NOT_FOUND);
	}

	const profile = await Profile
		.query()
		.where('user_id', user.id)
		.first();

	if (!profile) {
		return null;
	}

	return {
		badges: profile.badges,
		bio: profile.bio,
		id: profile.id,
		image: profile.image,
		title: profile.title,
		user_id: profile.user_id,
		username: user.username

	};
};
