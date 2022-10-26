// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon } from 'semantic-ui-react';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

const SearchBar = () : JSX.Element => {

	return (
		<div style={{ position: 'relative' }}>
			<div style={{ left:'10px', position:'absolute', top:'15px' }}><Icon  name='search' /></div>
			<div className="gcse-search" data-as_sitesearch={ ['moonbase', 'moonbeam', 'moonriver', 'kilt'].includes(NETWORK) ? `${NETWORK}.polkassembly.network` : `${NETWORK}.polkassembly.io` }></div>
		</div>
	);
};

export default SearchBar;
