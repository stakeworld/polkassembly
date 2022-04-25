// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import NetworkInfo from 'src/components/NetworkInfo';

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
				<Grid.Row className='margin-bottom-48'>
					<Grid.Column className='px-0'>
						<NetworkInfo className='margin-bottom-48 mb-sm-32' />
						<TreasuryOverviewCards className='margin-bottom-36' />
						<LatestActivity />
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
	.margin-bottom-48{
		margin-bottom: 48px;
	}
	
	.margin-bottom-36{
		margin-bottom: 36px;
	}

	.px-0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	@media only screen and (max-width: 768px){
		.px-sm-1 {
			padding-left: 1em !important;
			padding-right: 1em !important;
		}

		.mb-sm-32 {
			margin-bottom: 32px !important;
		}

		.stackable.grid>.row>.column {
			padding-left: 0 !important;
			padding-right: 0 !important;
		}
	}
`;
