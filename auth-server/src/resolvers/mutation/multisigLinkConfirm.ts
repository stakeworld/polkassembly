// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AuthService from '../../services/auth';
import { ChangeResponseType, Context, MultisigAddressLinkConfirmArgs } from '../../types';
import getTokenFromReq from '../../utils/getTokenFromReq';
import messages from '../../utils/messages';

export default async (
	parent: void,
	{
		network,
		address,
		addresses,
		ss58Prefix,
		threshold,
		signatory,
		signature
	}: MultisigAddressLinkConfirmArgs,
	ctx: Context): Promise<ChangeResponseType> => {
	const token = getTokenFromReq(ctx.req);
	const authServiceInstance = new AuthService();

	const updatedJWT = await authServiceInstance.MultiSigAddressLinkConfirm(
		token,
		network,
		address,
		addresses,
		ss58Prefix,
		threshold,
		signatory,
		signature
	);

	return { message: messages.ADDRESS_LINKING_SUCCESSFUL, token: updatedJWT };
};
