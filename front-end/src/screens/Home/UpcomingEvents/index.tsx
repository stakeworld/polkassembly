// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
// import { Image, List } from 'semantic-ui-react';

interface Props {
  className?: string
}

// const iframe = '<iframe src="https://calendar.google.com/calendar/embed?src=events%40polkassembly.io&ctz=Asia%2FKolkata" style="border: 0" frameborder="0" scrolling="no"></iframe>';

// function Iframe(props: any) {
// return (<div dangerouslySetInnerHTML={ { __html:  props.iframe?props.iframe:'' } } />);
// }

const UpcomingEvents = ({ className }: Props) => {
	// const listItems = [];
	// for (let i = 0; i <= 16; i++) {
	// listItems.push(
	// <List.Item className='news-list-item' key={i}>
	// <Image avatar src='https://avatars.githubusercontent.com/u/33775474?s=280&v=4' />
	// <List.Content>
	// <List.Description className='list-item-date'>
	// Jan 17, 2022 at 21:33 UTC
	// </List.Description>
	// <List.Header className='list-item-title'>New Project: Ajuna Network</List.Header>
	// </List.Content>
	// </List.Item>
	// );
	// }

	return (
		<div className={className}>
			<h1>Upcoming Events</h1>
			<div className="card">
				<p className="coming-soon-text">
					Coming Soon
				</p>
				{/* <Grid stackable>
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
								<List relaxed='very'>
									{ listItems }
								</List>
							</Grid.Column>
							<Grid.Column className='event-calendar-col' mobile={16} tablet={16} computer={10}>
								<div className="iframe-wrapper">
									<Iframe iframe={iframe} />
								</div>
							</Grid.Column>
						</Grid>
					</Grid.Row>
				</Grid> */}
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
		height: 500px;
		max-height: 500px;

		// for coming soon text
		display: flex;
		align-items: center;
		justify-content: center;

		.coming-soon-text {
			font-size: 3rem;
		}
		
		@media only screen and (max-width: 991.5px) {
			height: fit-content;
			max-height: fit-content;
		}

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

		.event-content-row {
			justify-content: center;
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
			max-height: 402px;
			border-right: 2px #eee solid;

			@media only screen and (max-width: 991.5px) {
				max-height: 120px !important;
			}
		}
		
		.event-list-col, .event-calendar-col{
			padding-top: 1em;
		}

		.event-calendar-col{
			height: 402px;

			.iframe-wrapper {
				position: relative;
				padding-bottom: 56.25%; /* 16:9 */
				padding-top: 25px;
				height: 0;
			}
			.iframe-wrapper iframe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 385px;
			}
	}

		.news-list-item {
			display: flex;

			.list-item-date {
				margin-left: 0.6em;
				color: #75767C;
				font-size: 0.88em;
			}

			.list-item-title {
				margin-left: 0.6em;
				font-weight: 500;
				font-size: 1.1em;
				margin-top: 0.2em;
			}
		}
	}
`;
