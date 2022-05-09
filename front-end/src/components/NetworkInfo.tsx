// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
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
			<div className="text">Join our Community to discuss, contribute and get regular updates from us!</div>
			{!error && data && data.blockchain_socials[0] &&
				<div className="networkInfo-icons">
					{data.blockchain_socials[0].homepage && <a href={data.blockchain_socials[0].homepage} target='_blank' rel='noreferrer'>
						<Icon name='home'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].twitter && <a href={data.blockchain_socials[0].twitter} target='_blank' rel='noreferrer'>
						<Icon name='twitter'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].discord && <a href={data.blockchain_socials[0].discord} target='_blank' rel='noreferrer'>
						<Icon name='discord'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].github && <a href={data.blockchain_socials[0].github} target='_blank' rel='noreferrer'>
						<Icon name='github'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].youtube && <a href={data.blockchain_socials[0].youtube} target='_blank' rel='noreferrer'>
						<Icon name='youtube'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].reddit && <a href={data.blockchain_socials[0].reddit} target='_blank' rel='noreferrer'>
						<Icon name='reddit alien'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].telegram && <a href={data.blockchain_socials[0].telegram} target='_blank' rel='noreferrer'>
						<Icon name='telegram plane'/>
					</a>
					}
					<span className="v-divider">|</span>
					{data.blockchain_socials[0].block_explorer && <a href={data.blockchain_socials[0].block_explorer} target='_blank' rel='noreferrer'>
						<Icon name='cube'/>
					</a>
					}

				</div>
			}
		</div>
	);
};

export default styled(NetworkInfo)`
	border-radius: 0.8em;
	-webkit-box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);
	-moz-box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);
	box-shadow: 0px 5px 10px 1px rgba(186,182,186,1);
	background: #E5007A !important;
	display: flex;
	padding: 24px 24px;
	color: #fff;
	font-size: 16px;
	width: 98%;
	justify-content: space-between;
	align-items: center;

	.networkInfo-icons{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:25%;
		/* max-width: 125px; */

		a {
			margin-top: 0.5em;
			margin-bottom: 0.5em;
		}

		.icon {
			color: #fff;
			margin-right: 0 !important;
		}

		.v-divider {
			color: rgba(226, 226, 226, 0.25);
		}
		
	}

	@media only screen and (max-width: 1189px) {
		padding: 20px 20px;
		flex-direction: column;
		justify-content: center;
		text-align: center;

		.networkInfo-icons {
			margin-top: 20px;
			margin-left: auto;
			margin-right: auto;
			width: 100% !important;
			max-width: 425px !important;

			.icon {
				font-size: 13.98px !important;
			}
		}
		
	}

	@media only screen and (max-width: 767px) {
		flex-direction: column;
		justify-content: center;
		text-align: left;
		margin-left: auto !important;
		margin-right: auto !important;

		.networkInfo-icons {
			margin-top: 20px;
			text-align: center;
		}
		
	}
	
`;
