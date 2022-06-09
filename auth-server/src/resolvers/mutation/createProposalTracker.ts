// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AuthService from '../../services/auth';
import { Context, CreateProposalTrackerArgs, MessageType } from '../../types';
import getTokenFromReq from '../../utils/getTokenFromReq';

export default async (
	parent: void,
	{
		onchain_proposal_id,
		status,
		deadline,
		network,
		start_time
	}: CreateProposalTrackerArgs,
	ctx: Context): Promise<MessageType> => {
	const authServiceInstance = new AuthService();
	const token = getTokenFromReq(ctx.req);

	await authServiceInstance.ProposalTrackerCreate(
		onchain_proposal_id,
		status,
		deadline,
		token,
		network,
		start_time
	);

	return { message: 'Status set successfully' };
};
