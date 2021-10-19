// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import About from '../../model/About';
import { AboutArgs, AboutType } from '../../types';

export default async (parent: void, { network, address }: AboutArgs): Promise<AboutType | null> => {
	const about = await About
		.query()
		.where({
			address,
			network
		})
		.first();

	if (!about) {
		return null;
	}

	return {
		address: about.address,
		description: about.description,
		image: about.image,
		network: about.network,
		title: about.title
	};
};
