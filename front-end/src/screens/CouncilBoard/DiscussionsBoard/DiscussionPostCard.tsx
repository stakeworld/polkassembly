// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { useDiscussionPostAndCommentsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Markdown from 'src/ui-components/Markdown';

import commentImg from '../../../assets/latest-activity-comment.png';

interface Props {
	className?: string
	id: number
	title?: string | null
	username?: string
	commentsCount?: number | null
	createdAt?: any
}

const DiscussionPostCard = ({ className, id, title, username, commentsCount, createdAt } : Props) => {

	const { data, error, loading, refetch } = useDiscussionPostAndCommentsQuery({ variables: { 'id': id } });

	const relativeCreatedAt = createdAt ?
		moment(createdAt).isBefore(moment().subtract(1,'w')) ?
			moment(createdAt).format('DD-MM-YY') :
			moment(createdAt).startOf('day').fromNow() :
		null;

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={className}>
			<h5>{title || noTitle}</h5>
			{ loading && <p>loading...</p>}
			{
				!loading && !error && data?.posts && data.posts.length > 0 && <Markdown md={`${(data.posts[0].content as string).split(' ').splice(0, 30).join(' ')}...` } />
			}

			<div className="info-bar">
				<div className="posted-by d-flex">
					<span className="title">Posted by </span>
					<span className="author">{username}</span>
				</div>

				<div className="right-info d-flex">
					<div className="comments d-flex">
						<img width='14px' height='14px' src={commentImg} alt="Comment" />
						{commentsCount}
					</div>
					<div className="time">
						<Icon name='clock outline' />
						{relativeCreatedAt}
					</div>
				</div>
			</div>
		</div>
	);
};

export default styled(DiscussionPostCard)`
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

	.info-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.posted-by {
			align-items: center;

			.title {
				color: #ABAEB4;
			}

			.author {
				margin-left: 8px;

				display: inline-block;
				width: 100px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		.right-info {
			.comments {
				img {
					margin-right: 8px;
				}

				align-items: center;
			}

			.time {
				margin-left: 24px;
			}
		}
	}
`;
