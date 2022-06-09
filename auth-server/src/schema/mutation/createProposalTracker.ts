// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `
    createProposalTracker(
		onchain_proposal_id: Int!,
		status: String!,
		deadline: String!,
		network: String!,
		start_time: String!
    ): Message
`;
