// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import AuthService from '../../services/auth';
import { ChangeResponseType, Context, LinkProxyAddressArgs } from '../../types';
import getTokenFromReq from '../../utils/getTokenFromReq';

export default async (parent: void, { network, proxied, proxy, message, signature }: LinkProxyAddressArgs, ctx: Context): Promise<ChangeResponseType> => {
	const token = getTokenFromReq(ctx.req);
	const authServiceInstance = new AuthService();
	const updatedJWT = await authServiceInstance.LinkProxyAddress(token, network, proxied, proxy, message, signature);

	return { message: 'Proxied address linked', token: updatedJWT };
};
