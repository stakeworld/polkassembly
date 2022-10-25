// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import debounce from 'lodash/debounce';
import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const SearchBar = () : JSX.Element => {

	return (
		<div style={{ position: 'relative' }}>
			<div style={{ left:'10px', position:'absolute', top:'15px' }}><Icon  name='search' /></div>
			<div className="gcse-search"></div>
		</div>
	);
};

export default SearchBar;
