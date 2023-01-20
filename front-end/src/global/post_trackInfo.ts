// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostOrigin, TrackInfoType } from 'src/types';

export const trackInfo: TrackInfoType = {
	[PostOrigin.ROOT] : {
		description: 'Origin for General network-wide improvements',
		trackId: 0
	},
	[PostOrigin.WHITELISTED_CALLER] : {
		description: 'Origin able to dispatch a whitelisted call.',
		group: 'Fellowship',
		trackId: 1
	},
	[PostOrigin.STAKING_ADMIN] : {
		description: 'Origin for cancelling slashes.',
		trackId: 10
	},
	[PostOrigin.TREASURER] : {
		description: 'Origin for spending (any amount of) funds.',
		group: 'Treasury',
		trackId: 11
	},
	[PostOrigin.LEASE_ADMIN] : {
		description: 'Origin able to force slot leases.',
		group: 'Governance',
		trackId: 12
	},
	[PostOrigin.FELLOWSHIP_ADMIN] : {
		description: 'Origin for managing the composition of the fellowship.',
		group: 'Fellowship',
		trackId: 13
	},
	[PostOrigin.GENERAL_ADMIN] : {
		description: 'Origin for managing the registrar.',
		group: 'Governance',
		trackId: 14
	},
	[PostOrigin.AUCTION_ADMIN] : {
		description: 'Origin for starting auctions.',
		trackId: 15
	},
	[PostOrigin.REFERENDUM_CANCELLER] : {
		description: 'Origin able to cancel referenda.',
		group: 'Governance',
		trackId: 20
	},
	[PostOrigin.REFERENDUM_KILLER] : {
		description: 'Origin able to kill referenda.',
		group: 'Governance',
		trackId: 21
	},
	[PostOrigin.SMALL_TIPPER] : {
		description: 'Origin able to spend up to 1 KSM from the treasury at once.',
		group: 'Treasury',
		trackId: 30
	},
	[PostOrigin.BIG_TIPPER] : {
		description: 'Origin able to spend up to 5 KSM from the treasury at once.',
		group: 'Treasury',
		trackId: 31
	},
	[PostOrigin.SMALL_SPENDER] : {
		description: 'Origin able to spend up to 500 KSM from the treasury at once.',
		group: 'Treasury',
		trackId: 32
	},
	[PostOrigin.MEDIUM_SPENDER] : {
		description: 'Origin able to spend up to 3,333 KSM from the treasury at once.',
		group: 'Treasury',
		trackId: 33
	},
	[PostOrigin.BIG_SPENDER] : {
		description: 'Origin able to spend up to 5,000 KSM from the treasury at once.',
		group: 'Treasury',
		trackId: 34
	}
};