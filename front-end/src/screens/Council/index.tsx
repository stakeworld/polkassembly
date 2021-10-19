// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

import InfoBox from '../../ui-components/InfoBox';
import CouncilContainer from './CouncilContainer';

const OnchainPostsContainer = ({ className } : {className?: string}) => {

	return (
		<div className={className}>
			<h1>Council</h1>
			<Grid stackable reversed='mobile tablet'>
				<Grid.Column mobile={16} tablet={16} computer={10}>
					<CouncilContainer />
				</Grid.Column>
				<Grid.Column mobile={16} tablet={16} computer={6}>
					<InfoBox
						dismissable={true}
						content='Council is the body of elected members that consists of several on-chain accounts. The Council can act as a representative for "passive" (non-voting) stakeholders. Council members have two main tasks: proposing referenda for the overall stakeholder group to vote on and cancelling malicious referenda.'
						name='onchainInfo'
						title='About Council'
					/>
				</Grid.Column>
			</Grid>
		</div>
	);

};

export default styled(OnchainPostsContainer)`

	h1 {
		@media only screen and (max-width: 576px) {
			margin: 3rem 1rem 1rem 1rem;
		}

		@media only screen and (max-width: 768px) and (min-width: 576px) {
			margin-left: 1rem;
		}

		@media only screen and (max-width: 991px) and (min-width: 768px) {
			margin-left: 1rem;
		}
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		.ui[class*="tablet reversed"].grid {
			flex-direction: column-reverse;
		}
	}
`;
