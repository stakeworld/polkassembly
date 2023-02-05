// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

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
	},
	[PostOrigin.CANDIDATES] : {
		description: 'Origin commanded by any members of the Polkadot Fellowship (no Dan grade needed)',
		trackId: 0,
		'name': 'candidates',
		'max_deciding': 10,
		'decision_deposit': 3333333333300,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.MEMBERS] : {
		description: 'Origin commanded by rank 1 of the Polkadot Fellowship and with a success of 1',
		trackId: 1,
		'name': 'members',
		'max_deciding': 10,
		'decision_deposit': 333333333330,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.PROFICIENTS] : {
		description: 'Origin commanded by rank 2 of the Polkadot Fellowship and with a success of 2',
		trackId: 2,
		'name': 'proficients',
		'max_deciding': 10,
		'decision_deposit': 333333333330,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.FELLOWS] : {
		description: 'Origin commanded by Polkadot Fellows (3rd Dan fellows or greater)',
		trackId: 3,
		'name': 'fellows',
		'max_deciding': 10,
		'decision_deposit': 333333333330,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.SENIOR_FELLOWS] : {
		description: 'Origin commanded by rank 4 of the Polkadot Fellowship and with a success of 4',
		trackId: 4,
		'name': 'senior fellows',
		'max_deciding': 10,
		'decision_deposit': 333333333330,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.EXPERTS] : {
		description: 'Origin commanded by Polkadot Experts (5th Dan fellows or greater)',
		trackId: 5,
		'name': 'experts',
		'max_deciding': 10,
		'decision_deposit': 33333333333,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.SENIOR_EXPERTS] : {
		description: 'Origin commanded by rank 6 of the Polkadot Fellowship and with a success of 6',
		trackId: 6,
		'name': 'senior experts',
		'max_deciding': 10,
		'decision_deposit': 33333333333,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.MASTERS] : {
		description: 'Origin commanded by Polkadot Masters (7th Dan fellows of greater)',
		trackId: 7,
		'name': 'masters',
		'max_deciding': 10,
		'decision_deposit': 33333333333,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.SENIOR_MASTERS] : {
		description: 'Origin commanded by rank 8 of the Polkadot Fellowship and with a success of 8',
		trackId: 8,
		'name': 'senior masters',
		'max_deciding': 10,
		'decision_deposit': 33333333333,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	},
	[PostOrigin.GRAND_MASTERS] : {
		description: 'Origin commanded by rank 9 of the Polkadot Fellowship and with a success of 9',
		trackId: 9,
		'name': 'grand masters',
		'max_deciding': 10,
		'decision_deposit': 33333333333,
		'prepare_period': 300,
		'decision_period': 100800,
		'confirm_period': 300,
		'min_enactment_period': 10,
		'min_approval': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 500000000,
				'ceil': 1000000000
			}
		},
		'min_support': {
			'linear_decreasing': {
				'length': 1000000000,
				'floor': 0,
				'ceil': 500000000
			}
		}
	}
};