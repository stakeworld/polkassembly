// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostOrigin, TrackInfoType } from 'src/types';

export const trackInfo: TrackInfoType = {
	[PostOrigin.ROOT] : {
		displayName: 'Main Agenda',
		trackId: 0
	},
	[PostOrigin.WHITELISTED_CALLER] : {
		displayName: 'Whitelist',
		group: 'Fellowship',
		trackId: 1
	},
	[PostOrigin.STAKING_ADMIN] : {
		displayName: 'Staking',
		trackId: 10
	},
	[PostOrigin.TREASURER] : {
		displayName: 'Any',
		group: 'Treasury',
		trackId: 11
	},
	[PostOrigin.LEASE_ADMIN] : {
		displayName: 'Lease',
		group: 'Governance',
		trackId: 12
	},
	[PostOrigin.FELLOWSHIP_ADMIN] : {
		displayName: 'Admin',
		group: 'Fellowship',
		statuses: [
			'Proposed',
			'Tabled',
			'Opened',
			'Executed',
			'Rejected',
			'Extended',
			'Awarded'
		],
		trackId: 13
	},
	[PostOrigin.GENERAL_ADMIN] : {
		displayName: 'Registrar',
		group: 'Governance',
		trackId: 14
	},
	[PostOrigin.AUCTION_ADMIN] : {
		displayName: 'Crowd Loans',
		trackId: 15
	},
	[PostOrigin.REFERENDUM_CANCELLER] : {
		displayName: 'Canceller',
		group: 'Governance',
		trackId: 20
	},
	[PostOrigin.REFERENDUM_KILLER] : {
		displayName: 'Killer',
		group: 'Governance',
		trackId: 21
	},
	[PostOrigin.SMALL_TIPPER] : {
		displayName: 'Small Tips',
		group: 'Treasury',
		trackId: 30
	},
	[PostOrigin.BIG_TIPPER] : {
		displayName: 'Big Tips',
		group: 'Treasury',
		trackId: 31
	},
	[PostOrigin.SMALL_SPENDER] : {
		displayName: 'Small Spend',
		group: 'Treasury',
		trackId: 32
	},
	[PostOrigin.MEDIUM_SPENDER] : {
		displayName: 'Medium Spend',
		group: 'Treasury',
		trackId: 33
	},
	[PostOrigin.BIG_SPENDER] : {
		displayName: 'Big Spend',
		group: 'Treasury',
		trackId: 34
	}
};