// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import SearchBar from 'src/ui-components/SearchBar';

interface Props {
	className?: string
}

const LatestActivitySearchPage = ({ className }:Props) => {
	return <Tab.Pane className={className}>
		<SearchBar placeholder='Search' className='search-bar' />
	</Tab.Pane>;
};

export default styled(LatestActivitySearchPage)`
	&&& {
      background: transparent;
      display: flex;
			align-items: start;
			justify-content: center;
			height: 40vh;
			overflow-y: hidden !important;

			.search-bar {
				margin-right: 1em;
				margin-top: 2em;
	
				input {
					color: #333;
					background: rgba(255, 255, 255, 0.25);
					border-radius: 0.7em !important;
					padding-top: 0.7em;
					padding-bottom: 0.7em;
					width: 69rem;
					max-width: 70vw !important;
				}
	
				.results {
					width: 47vw !important;
					overflow-y: auto;
					height: 70vh;
				}
			}
	}
`;
