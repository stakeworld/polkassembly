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
				<Grid.Row className='margin-bottom-48'>
					<Grid.Column width={16}>
						<h1 className='dashboard-heading'>Dashboard</h1>
						<NetworkInfo className='margin-bottom-48' />
						<TreasuryOverviewCards className='margin-bottom-48' />
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
	.dashboard-heading {
		font-size: 48px;
		font-weight: 500;
		margin-bottom: 36px;
	}

	.margin-bottom-48{
		margin-bottom: 48px;
	}
`;
