// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import SearchBar from 'src/ui-components/SearchBar';

interface Props {
  className?: string
}

const SearchScreen = ({ className }: Props) => {
	return (
		<Container className={className}>
			<Grid stackable reversed='mobile tablet'>
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<h3>Search</h3>
					<SearchBar />
				</Grid.Column>
			</Grid>
		</Container>
	);
};

export default SearchScreen;
