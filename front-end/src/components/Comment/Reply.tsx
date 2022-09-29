// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import {
	DiscussionPostAndCommentsQuery,
	DiscussionPostAndCommentsQueryVariables,
	MotionPostAndCommentsQuery,
	MotionPostAndCommentsQueryVariables,
	ProposalPostAndCommentsQuery,
	ProposalPostAndCommentsQueryVariables,
	ReferendumPostAndCommentsQuery,
	ReferendumPostAndCommentsQueryVariables,
	ReplyFieldsFragment,
	TipPostAndCommentsQuery,
	TipPostAndCommentsQueryVariables,
	TreasuryProposalPostAndCommentsQuery,
	TreasuryProposalPostAndCommentsQueryVariables } from '../../generated/graphql';
import Avatar from '../../ui-components/Avatar';
import CreationLabel from '../../ui-components/CreationLabel';
import UpdateLabel from '../../ui-components/UpdateLabel';
import EditableReplyContent from './EditableReplyContent';

interface Props{
	className?: string,
	reply: ReplyFieldsFragment,
	refetch: (variables?:
		ReferendumPostAndCommentsQueryVariables |
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

export const Reply = ({ className, reply, refetch } : Props) => {
	const { author, content, comment_id, created_at, id, updated_at } = reply;
	const { hash } = useLocation();
	const replyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hash === `#${id}`) {
			window.scrollTo(0, replyRef.current?.offsetTop || 0);
		}
	}, [hash, id]);

	if (!author || !author.id || !author.username || !content) return <div>Reply not available</div>;

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div id={id} ref={replyRef} className={className}>
			<Avatar
				className='avatar'
				username={author.username}
				size={'lg'}
				id={id}
			/>
			<div className='comment-box'>
				<CreationLabel
					className='creation-label'
					created_at={created_at}
					defaultAddress={defaultAddress}
					text={'replied'}
					username={author.username}
				>
					<UpdateLabel
						created_at={created_at}
						updated_at={updated_at}
					/>
				</CreationLabel>
				<EditableReplyContent
					authorId={author.id}
					className='comment-content'
					commentId={comment_id}
					reply={reply}
					replyId={id}
					content={content}
					refetch={refetch}
				/>
			</div>
		</div>
	);
};

export default styled(Reply)`
	display: flex;
	margin-top: 1rem;

	.avatar {
		display: inline-block;
		flex: 0 0 4rem;
		margin-right: 2rem;
		@media only screen and (max-width: 576px) {
			display: none;
		}
	}

	.comment-box {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		margin-bottom: 1rem;
		width: calc(100% - 60px);
		word-break: break-word;

		@media only screen and (max-width: 576px) {
			width: 100%;
			border-radius: 0px;
		}
	}

	.creation-label {
		display: inline-flex;
		padding: 1rem 0 0.8rem 2rem;
		margin-bottom: 0;
	}

	.comment-content {
		padding: 0.8rem 2rem;
		width: 100%;
	}
`;
