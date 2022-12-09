// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gov2Routes } from 'src/components/AppLayout/SwitchRoutes';

export default function checkGov2Route(pathname: string): boolean {
	if(pathname === '/referenda'){
		return false;
	}

	return gov2Routes.includes(pathname.split('/')[1]);
}