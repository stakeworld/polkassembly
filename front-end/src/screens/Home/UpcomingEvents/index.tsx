// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Checkbox, Grid, Icon } from 'semantic-ui-react';

interface Props {
  className?: string
}

const UpcomingEvents = ({ className }: Props) => {
	return (
		<div className={className}>
			<h1>Upcoming Events</h1>
			<div className="card">
				<Grid stackable>
					<Grid.Row>
						<Grid.Column className='action-bar' width={16}>
							<Icon name='search' />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className='event-filter-row'>
						<Grid.Column className='event-filter-bar' width={16}>
							<Checkbox className='event-checkbox' label='&nbsp;Auction' />
							<Checkbox className='event-checkbox' label='&nbsp;Update' />
							<Checkbox className='event-checkbox' label='&nbsp;Community' />
							<Checkbox className='event-checkbox' label='&nbsp;Launch' />
							<Checkbox className='event-checkbox' label='&nbsp;Miscellaneous' />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className='event-content-row'>
						<Grid columns={2} className='event-content-row'>
							<Grid.Column className='event-list-col' mobile={16} tablet={16} computer={6}>
								Events List
							</Grid.Column>
							<Grid.Column className='event-calendar-col' mobile={16} tablet={16} computer={10}>
								Calendar
							</Grid.Column>
						</Grid>
					</Grid.Row>
				</Grid>
			</div>
		</div>
	);
};

export default styled(UpcomingEvents)`
	.card {
		background: #fff;
		padding-left: 1rem;
		padding-right: 1rem;
		border-radius: 10px;
		max-height: 500px;

		.action-bar {
			display: flex !important;
			justify-content: end !important;
			border-bottom: 2px #eee solid;
			padding-bottom: 1em;
		}

		.event-filter-row, .event-content-row{
			padding-bottom: 0;
			padding-top: 0;
		}
		
		.event-filter-bar {
			border-bottom: 2px #eee solid;
			padding-bottom: 1em;

			.event-checkbox {
				margin-right: 2em !important;
				margin-top: 1em !important;
			}
		}

		.event-list-col {
			overflow-y: auto;
			border-right: 2px #eee solid;
		}
		
		.event-list-col, .event-calendar-col{
			padding-top: 1em;
		}
	}

`;
