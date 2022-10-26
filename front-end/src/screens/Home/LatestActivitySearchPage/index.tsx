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
		<SearchBar />
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
	}
`;
