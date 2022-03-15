// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { Card, Grid, Icon } from 'semantic-ui-react';
import { useNetworkSocialsQuery } from 'src/generated/graphql';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
}

const NetworkInfo = ({ className }: Props) => {
	const network = getNetwork();

	const { data, error, refetch } = useNetworkSocialsQuery({ variables: {
		network
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={className}>
			<Card fluid className='networkInfo-card'>
				<Card.Content>
					<Grid centered stackable columns={2} verticalAlign='middle'>
						<Grid.Column className='networkInfo-text' mobile={16} tablet={8} computer={10}>
							<h4> Join our community to discuss, contribute and get regular updates from us! </h4>
						</Grid.Column>
						<Grid.Column className='networkInfo-icons' mobile={16} tablet={8} computer={6}>
							{
								!error && data &&
									<Grid centered stackable columns={8} verticalAlign='middle'>
										{ data.blockchain_socials[0].homepage &&
											<a href={data.blockchain_socials[0].homepage} target='_blank' rel='noreferrer'>
												<Icon size='large' name='home'/>
											</a>
										}
										{ data.blockchain_socials[0].twitter &&
											<a href={data.blockchain_socials[0].twitter} target='_blank' rel='noreferrer'>
												<Icon size='large' name='twitter'/>
											</a>
										}
										{data.blockchain_socials[0].discord &&
											<a href={data.blockchain_socials[0].discord} target='_blank' rel='noreferrer'>
												<Icon size='large' name='discord'/>
											</a>
										}
										{data.blockchain_socials[0].github &&
											<a href={data.blockchain_socials[0].github} target='_blank' rel='noreferrer'>
												<Icon size='large' name='github'/>
											</a>
										}
										{data.blockchain_socials[0].youtube &&
											<a href={data.blockchain_socials[0].youtube} target='_blank' rel='noreferrer'>
												<Icon size='large' name='youtube'/>
											</a>
										}
										{data.blockchain_socials[0].reddit &&
											<a href={data.blockchain_socials[0].reddit} target='_blank' rel='noreferrer'>
												<Icon size='large' name='reddit alien'/>
											</a>
										}
										{data.blockchain_socials[0].telegram &&
											<a href={data.blockchain_socials[0].telegram} target='_blank' rel='noreferrer'>
												<Icon size='large' name='telegram plane'/>
											</a>
										}
										{data.blockchain_socials[0].block_explorer &&
											<a href={data.blockchain_socials[0].block_explorer} target='_blank' rel='noreferrer'>
												<Icon size='large' name='cube'/>
											</a>
										}
									</Grid>
							}
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
