// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Card, Grid, Icon } from 'semantic-ui-react';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
}

const NetworkInfo = ({ className }: Props) => {
	const network = getNetwork();
	const links = chainLinks[network];

	return (
		<div className={className}>
			<Card fluid className='networkInfo-card'>
				<Card.Content>
					<Grid centered stackable columns={2} verticalAlign='middle'>
						<Grid.Column className='networkInfo-text' mobile={16} tablet={8} computer={10}>
							<h4> Join our community to discuss, contribute and get regular updates from us! </h4>
						</Grid.Column>
						<Grid.Column className='networkInfo-icons' mobile={16} tablet={8} computer={6}>
							<Grid centered stackable columns={8} verticalAlign='middle'>
								<a href={links.homepage} target='_blank' rel='noreferrer'>
									<Icon size='large' name='home'/>
								</a>
								<a href={links.twitter} target='_blank' rel='noreferrer'>
									<Icon size='large' name='twitter'/>
								</a>
								<a href={links.discord} target='_blank' rel='noreferrer'>
									<Icon size='large' name='discord'/>
								</a>
								<a href={links.github} target='_blank' rel='noreferrer'>
									<Icon size='large' name='github'/>
								</a>
								<a href={links.youtube} target='_blank' rel='noreferrer'>
									<Icon size='large' name='youtube'/>
								</a>
								<a href={links.reddit} target='_blank' rel='noreferrer'>
									<Icon size='large' name='reddit alien'/>
								</a>
								<a href={links.telegram} target='_blank' rel='noreferrer'>
									<Icon size='large' name='telegram plane'/>
								</a>
								<a href={links.blockExplorer} target='_blank' rel='noreferrer'>
									<Icon size='large' name='cube'/>
								</a>
							</Grid>
						</Grid.Column>
					</Grid>
				</Card.Content>
			</Card>
		</div>
	);
};

export default styled(NetworkInfo)`
	.networkInfo-card {
		background: #E5007A !important;
		border-radius: 0.8em;
		padding: 0.8em 0.3em 0.8em 0.3em;
		-webkit-box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);
		-moz-box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);
		box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);

		.networkInfo-text{
			h4 {
				color: #fff !important;
				font-weight: 400;
			}
		}

		.networkInfo-icons{
			a {
				margin-top: 0.5em;
				margin-bottom: 0.5em;
	
				padding-right: 0.5em;
				&:not(:first-child) {
					padding-left: 0.5em;
					border-left: 1px solid rgba(238, 238, 238, 0.3);
				}
			}

			.icon {
				color: #fff;
			}
			
		}
	}
`;
