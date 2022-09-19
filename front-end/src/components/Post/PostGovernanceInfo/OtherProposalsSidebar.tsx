// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon, Message } from 'semantic-ui-react';
import { useGetUsersProposalsQuery } from 'src/generated/graphql';

import AddressComponent from '../../../ui-components/Address';

interface Props {
  className?: string
	routeWrapperHeight: number
	closeOtherProposalsSidebar: () => void
	proposerAddress: string
}

const OtherProposalsSidebar = ({ className, routeWrapperHeight, closeOtherProposalsSidebar, proposerAddress }:Props) => {
	const { data, loading, error } = useGetUsersProposalsQuery({
		variables: {
			proposer_address: proposerAddress
		}
	});

	return (
		<div className={className} style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>
			<div className="d-flex other-proposals-heading">
				<div className='d-flex heading-text'>Proposals by <span className='addr-cont'><AddressComponent address={proposerAddress}/></span></div>
				<Icon className='close-icon' name='close' onClick={closeOtherProposalsSidebar} />
			</div>

			{!loading && error && <Message negative>
				<Message.Header>There was an error loading the posts.</Message.Header>
				<p>Please try again :(</p>
			</Message>
			}

			{loading && <div className="loading-cont d-flex"><Icon loading name='circle notched' size='big' /></div>}

			{!loading && !error && data?.posts &&
				<>
					{
						data?.posts.length > 0 ?
							<>
								{data?.posts.map(post => (
									<div className='post-card' key={post.id}>
										{post.id} ID
									</div>
								))}
							</> :
							<div className="loading-cont d-flex">
								No other proposals found.
							</div>
					}
				</>
			}
		</div>
	);
};

export default styled(OtherProposalsSidebar)`
	position: fixed;
	min-width: 250px;
	width: 700px;
	min-width: 30vw;
	max-width: 55vw;
	height: 100vh;
	right: 0;
	top: 0;
	background: #fff;
	z-index: 100;
	padding: 40px 24px;
	box-shadow: -5px 0 15px -12px #888;
	overflow-y: auto;

	@media only screen and (max-width: 768px) {
		max-width: 90vw;
		top: 0;
		padding: 40px 14px;
		padding-top: 70px;
		overflow-y: auto;
	}

	.other-proposals-heading {
		align-items: center;
		justify-content: space-between;
		width: 100%;
		font-size: 24px;
		font-weight: 500;
		color: #222;

		.heading-text {
			align-items: center;
		}

		.addr-cont {
			margin-left: 14px;

			.description {
				font-size: 22px;
			}
		}

		.close-icon {
			cursor: pointer;
			font-size: 16px;
			color: #999;

			&:hover {
				color: #333;
			}
		}
	}

	.loading-cont {
		width: 100%;
		height: 50px;
		margin-top: 50px;
		align-items: center;
		justify-content: center;
	}

	.post-card {
		border: 1px #eee solid;
		margin-top: 24px;
		border-radius: 4px;
		padding: 14px;
	}
`;