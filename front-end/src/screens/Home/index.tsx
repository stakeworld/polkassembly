// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Grid } from 'semantic-ui-react';

import NetworkInfo from '../../components/NetworkInfo';
import LatestActivity from './LatestActivity';
import News from './News';
import TreasuryOverviewCards from './TreasuryOverviewCards';
import UpcomingEvents from './UpcomingEvents';

interface Props {
  className?: string
}

const Home = ({ className }: Props) => {
	return (
		<div className={className}>
			<Grid stackable>
				<Grid.Row>
					<Grid.Column width={16}>
						<h1 style={ { fontSize: '4.4rem', fontWeight: 500 } }>Dashboard</h1>
						<NetworkInfo />
						<br/><br/>
						<TreasuryOverviewCards />
						<br/><br/>
						<LatestActivity />
						<br/><br/>
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={10}>
						<UpcomingEvents />
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={6}>
						<News />
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</div>
	);
};

export default styled(Home)`

	.referendumContainer, .proposalContainer, .discussionContainer, .motionContainer, .treasuryContainer, .tipContainer, .bountyContainer, .techCommitteeProposalContainer {
		margin-bottom: 3rem;
	}

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

	@media only screen and (max-width: 992px) {
		.default-address-infobox {
			display: none;
		}
	}

	@media only screen and (max-width: 768px) {

		.mainButtonContainer {
			margin: 0rem;
		}
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		.ui[class*="tablet reversed"].grid {
			flex-direction: column-reverse;
		}

		.mainButtonContainer {
			margin-top: 1rem!important;
		}
	}

	@media only screen and (max-width: 576px) {

		.mainButtonContainer {
			align-items: stretch!important;
			margin: 1rem!important;

			.newPostButton {
				padding: 0.8rem 1rem;
				border-radius: 0.5rem;
			}
		}
	}

	li {
        list-style-type: none;
    }

	.mainButtonContainer {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 2rem;
	}
`;
