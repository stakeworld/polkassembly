// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useContext, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetLatestReferendaPostsWithVotesQuery, useReferendumPostAndCommentsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Markdown from 'src/ui-components/Markdown';
import StatusTag from 'src/ui-components/StatusTag';

interface Props {
	className?: string
	title?: string | null
	method: string | undefined
	postStatus: string | undefined
	createdAt?: any
	referendumId: number

	content?: string | null
	username?: string
	commentsCount?: number | null
}

const ReferendaPostCard = ({ className, createdAt, postStatus, referendumId, title, method } : Props) => {
	// const { defaultAddress } = useContext(UserDetailsContext);
	const defaultAddress = '12NLgzqfhuJkc9mZ5XUTTG85N8yhhzfptwqF1xVhtK3ZX7f6';

	const { data, error, loading, refetch } = useReferendumPostAndCommentsQuery({ variables: { 'id': referendumId } });

	const { data:voteData, loading:voteLoading, error:voteError } = useGetLatestReferendaPostsWithVotesQuery({
		variables: {
			referendumId: referendumId,
			voter: `${defaultAddress}`
		}
	});

	useEffect(() => {
		refetch();
	},[refetch]);

	useEffect(() => {
		if(!voteData) return;
		console.log('voteData: ', voteData.referendumVotes);
	},[voteData]);

	const relativeCreatedAt = createdAt ?
		moment(createdAt).isBefore(moment().subtract(1,'w')) ?
			moment(createdAt).format('DD-MM-YY') :
			moment(createdAt).startOf('day').fromNow() :
		null;

	return (
		<div className={className}>
			<div className="vote-history">
				{!voteLoading && !voteError && voteData && voteData.referendumVotes.length > 0 &&
				<>
					<span>Icon</span> on 22 Jul, 3:00pm
				</>
				}
			</div>

			<h5>{title || method || noTitle}</h5>
			{ loading && <p>loading...</p>}
			{
				!loading && !error && data?.posts && data.posts.length > 0 && <Markdown md={`${(data.posts[0].content as string).split(' ').splice(0, 30).join(' ')}...` } />
			}

			<div className="info-bar">
				<div className="referenda-post-status">
					{postStatus && <StatusTag className='post_tags' status={postStatus}/>}
				</div>

				<div className="right-info d-flex">
					<div className="time">
						<Icon name='clock outline' />
						{relativeCreatedAt}
					</div>
				</div>
			</div>
		</div>
	);
};

export default styled(ReferendaPostCard)`
	background: #FFFFFF;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.16);
	border-radius: 8px;
	padding: 15px 20px;

	h5 {
		font-size: 16px;
	}

	p {
		font-size: 14px;
		margin: 12px auto;
	}

	.vote-history {
		font-weight: 500;
		font-size: 12px;
		margin-bottom: 6px;

		&.yay {
			color: #5BC044;
		}

		&.nay {
			color: #FF0000;
		}
	}

	.info-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.referenda-post-status {
			font-size: 14px;
			/* padding: 4px 8px; */
			border-radius: 4px;
			color: #FFFFFF;
		}

		.right-info {
			.time {
				margin-left: 24px;
			}
		}
	}
`;
