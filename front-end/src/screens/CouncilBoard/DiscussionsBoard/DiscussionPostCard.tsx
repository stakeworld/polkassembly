// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React from 'react';
import { Icon } from 'semantic-ui-react';

import commentImg from '../../../assets/latest-activity-comment.png';

interface Props {
	className?: string
	title?: string | null
	content?: string | null
	username?: string
	commentsCount?: number | null
	createdAt?: any
}

const DiscussionPostCard = ({ className, title, content, username, commentsCount, createdAt } : Props) => {

	const relativeCreatedAt = createdAt ?
		moment(createdAt).isBefore(moment().subtract(1,'w')) ?
			moment(createdAt).format('DD-MM-YY') :
			moment(createdAt).startOf('day').fromNow() :
		null;

	return (
		<div className={className}>
			<h5>{title}</h5>
			<p>{content}</p>

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
