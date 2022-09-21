// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';
import { useGetUsersProposalsQuery } from 'src/generated/graphql';
import StatusTag from 'src/ui-components/StatusTag';

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
			<Icon className='close-icon' name='close' onClick={closeOtherProposalsSidebar} />
			<div className="d-flex other-proposals-heading">
				Proposals by <span className='addr-cont'><AddressComponent address={proposerAddress}/></span>
			</div>

			{!loading && error && <Message negative>
				<Message.Header>There was an error loading the posts.</Message.Header>
				<p>Please try again :(</p>
				<p>{error.message}</p>
			</Message>
			}

			{loading && <div className="loading-cont d-flex"><Icon loading name='circle notched' size='big' /></div>}

			{!loading && !error && data?.posts &&
				<>
					{
						data?.posts.length > 0 ?
							<div className='posts-cont'>
								{data?.posts.map(post => {
									const proposalType = post.onchain_link?.onchain_proposal_id ? 'proposal' : 'treasury';
									const onChainLinkID = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal_id : post.onchain_link?.onchain_treasury_proposal_id;
									const status = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal[0]?.proposalStatus?.[0].status : post.onchain_link?.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
									const toPath = proposalType == 'proposal' ? `/${proposalType}/${onChainLinkID}` : `/${proposalType}/${onChainLinkID}`;

									return <Link key={post.id} to={toPath} onClick={closeOtherProposalsSidebar}>
										<div className='post-card'>
											{status && <StatusTag className='statusTag' status={status} />}
											<h6>{post.title || `#${onChainLinkID} Untitled`}</h6>
											<div className='d-flex created-at-cont'> <Icon name='clock outline' /> {post.created_at ? moment(post.created_at).startOf('day').fromNow() : null}</div>
										</div>
									</Link>;
								})}
							</div> :
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
	min-height: 100vh;
	max-height: 100vh;
	right: 0;
	top: 0;
	background: #fff;
	z-index: 1001;
	padding: 40px 24px;
	box-shadow: -5px 0 15px -12px #888;
	overflow-y: auto;

	@media only screen and (max-width: 768px) {
		max-width: 90vw;
		top: 0;
		padding: 40px 16px;
		overflow-y: auto;
	}

	.close-icon {
		position: absolute;
		top: 15px;
		right: 18px;
		cursor: pointer;
		font-size: 16px;
		color: #999;

		&:hover {
			color: #333;
		}
	}

	.other-proposals-heading {
		align-items: center;
		width: 100%;
		font-size: 24px;
		font-weight: 500;
		color: #222;

		@media only screen and (max-width: 576px) {
			flex-direction: column !important;
			align-items: flex-start;
		}

		.addr-cont {
			margin-left: 14px;

			@media only screen and (max-width: 576px) {
				margin-left: 0;
				margin-top: 12px;
			}

			.description {
				font-size: 22px;
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

	.posts-cont {
		margin-top: 12px;
		margin-bottom: 32px;
		max-height: 83vh;
		height: 83vh;
		overflow: auto;

		@media only screen and (min-width: 576px) {
			margin-top: 12px;
			margin-bottom: 56px;
		}
	}

	.post-card {
		border: 1px #eee solid;
		margin-top: 24px;
		border-radius: 4px;
		padding: 16px;

		h6 {
			color: #334D6E;
			margin-top: 14px;
		}

		.created-at-cont {
			color: #90A0B7;
			margin-top: 10px;
		}
	}
`;