// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import { Grid, Image,List } from 'semantic-ui-react';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

interface Props {
  className?: string
}

const network = getNetwork();

const News = ({ className }: Props) => {
	const listItems = [];
	for (let i = 0; i <= 16; i++) {
		listItems.push(
			<List.Item className='news-list-item' key={i}>
				<Image avatar src='https://avatars.githubusercontent.com/u/33775474?s=280&v=4' />
				<List.Content>
					<List.Description className='list-item-date'>
						Jan 17, 2022 at 21:33 UTC
					</List.Description>
					<List.Header className='list-item-title'>New Project: Ajuna Network</List.Header>
				</List.Content>
			</List.Item>
		);
	}

	const profile = chainLinks[network].twitter.split('/')[3];

	return (
		<div className={className}>
			<h1>News</h1>
			<div className="card">
				<Grid stackable>
					{/* <Grid.Row>
						<Grid.Column className='action-bar' width={16}>
							<Icon name='search' />
						</Grid.Column>
					</Grid.Row> */}
					<Grid.Row className='event-content-row'>
						<Grid.Column className='event-list-col' width={16}>
							{/* <List relaxed='very'>
								{ listItems }
							</List> */}
							<TwitterTimelineEmbed
								sourceType="profile"
								screenName={profile}
								options={ { height: 480 } }
								noHeader={true}
								noFooter={true}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</div>
	);
};

export default styled(News)`
	@media only screen and (max-width: 991.5px) {
		margin-top: 3em;
	}

	h1 {
		margin-bottom: 4rem;
	}

	.card {
		background: #fff;
		padding-left: 1rem;
		padding-right: 1rem;
		border-radius: 10px;
		height: 500px;
		max-height: 500px;

		.action-bar {
			display: flex !important;
			justify-content: end !important;
			border-bottom: 2px #eee solid;
			padding-bottom: 1em;
		}

		.event-content-row{
			padding-top: 0;
		}

		.event-list-col {
			overflow-y: hidden;
			border-right: 2px #eee solid;
			max-height: 496px;
			padding-top: 10px;
			padding-left: 1.5em !important;
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
