// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

const NewsView = ({ className } : {className?: string}) => {

	return (
		<div className={className}>
			<h1>News</h1>
			<Grid stackable reversed='mobile tablet'>
				<Grid.Column className='timeline-col' mobile={16} tablet={16} computer={10}>
					<TwitterTimelineEmbed
						sourceType="profile"
						screenName="polk_gov"
						autoHeight={true}
					/>
				</Grid.Column>
			</Grid>
		</div>
	);

};

export default styled(NewsView)`

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

	.timeline-col{
		height: 95vh;
	}
`;
