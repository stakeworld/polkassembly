// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostOrigin } from 'src/types';

export const trackInfo = {
	[PostOrigin.ROOT] : {
		trackId: 0
	},
	[PostOrigin.WHITELISTED_CALLER] : {
		trackId: 1
	},
	[PostOrigin.TREASURER] : {
		trackId: 11
	},
	[PostOrigin.LEASE_ADMIN] : {
		trackId: 12
	},
	[PostOrigin.FELLOWSHIP_ADMIN] : {
		trackId: 13
	},
	[PostOrigin.GENERAL_ADMIN] : {
		trackId: 14
	},
	[PostOrigin.AUCTION_ADMIN] : {
		trackId: 15
	},
	[PostOrigin.REFERENDUM_CANCELLER] : {
		trackId: 20
	},
	[PostOrigin.REFERENDUM_KILLER] : {
		trackId: 21
	},
	[PostOrigin.SMALL_TIPPER] : {
		trackId: 30
	},
	[PostOrigin.BIG_TIPPER] : {
		trackId: 31
	},
	[PostOrigin.SMALL_SPENDER] : {
		trackId: 32
	},
	[PostOrigin.MEDIUM_SPENDER] : {
		trackId: 33
	},
	[PostOrigin.BIG_SPENDER] : {
		trackId: 34
	}
};