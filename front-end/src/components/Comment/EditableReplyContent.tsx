// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useContext, useEffect, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { GoCheck, GoX } from 'react-icons/go';
import { Icon } from 'semantic-ui-react';

import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
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
	TreasuryProposalPostAndCommentsQueryVariables,
	useDeleteCommentReplyMutation,
	useEditCommentReplyMutation } from '../../generated/graphql';
import { NotificationStatus } from '../../types';
import Button from '../../ui-components/Button';
import { Form } from '../../ui-components/Form';
import Markdown from '../../ui-components/Markdown';
import ContentForm from '../ContentForm';
import ReportButton from '../ReportButton';

interface Props {
	authorId: number,
	className?: string,
	reply: ReplyFieldsFragment,
	commentId: string,
	content: string,
	replyId: string,
	refetch: (variables?:
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		ReferendumPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined
	) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

const EditableReplyContent = ({ authorId, className, commentId, content, replyId, refetch }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const { id } = useContext(UserDetailsContext);
	const [newContent, setNewContent] = useState(content || '');
	const toggleEdit = () => setIsEditing(!isEditing);
	const { queueNotification } = useContext(NotificationContext);
	const { control, errors, handleSubmit, setValue } = useForm();

	useEffect(() => {
		isEditing && setValue('content',content);
	},[content, isEditing, setValue]);

	const handleCancel = () => {
		toggleEdit();
		setNewContent(content || '');
	};

	const handleSave = () => {
		setIsEditing(false);
		editCommentReplyMutation( {
			variables: {
				content: newContent,
				id: replyId
			} }
		)
			.then(({ data }) => {
				if (data?.update_replies && data.update_replies.affected_rows > 0){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your reply was edited.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => console.error('Error saving reply: ',e));
	};

	const onContentChange = (data: Array<string>) => {setNewContent(data[0]); return data[0].length ? data[0] : null;};
	// const onReplyContentChange = (data: Array<string>) => {setReplyContent(data[0]); return data[0].length ? data[0] : null;};

	const [editCommentReplyMutation, { error, loading }] = useEditCommentReplyMutation({
		variables: {
			content: newContent,
			id: commentId
		}
	});

	const [deleteCommentReplyMutation] = useDeleteCommentReplyMutation({
		variables: {
			id: replyId
		}
	});

	const deleteReply = () => {
		deleteCommentReplyMutation( {
			variables: {
				id: replyId
			} }
		)
			.then(({ data }) => {
				if (data?.delete_replies && data.delete_replies.affected_rows > 0){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your reply was deleted.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => {
				console.error('Error deleting reply: ', e);

				queueNotification({
					header: 'Error!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
			});
	};

	return (
		<>
			<div className={className}>
				{error?.message && <div>{error.message}</div>}
				{
					isEditing
						?
						<Form standalone={false}>
							<Controller
								as={<ContentForm
									errorContent={errors.content}
								/>}
								name='content'
								control={control}
								onChange={onContentChange}
								rules={{ required: true }}
							/>
							<div className='button-container'>
								<Button secondary size='small' onClick={handleCancel}><GoX className='icon'/>Cancel</Button>
								<Button primary size='small' onClick={handleSubmit(handleSave)}><GoCheck className='icon' />Save</Button>
							</div>
						</Form>
						:
						<>
							<Markdown md={content} />
							<div className='actions-bar'>
								{id === authorId &&
									<Button className={'social'} disabled={loading} onClick={toggleEdit}>
										{
											loading
												? <><Icon name='spinner' className='icon'/>Editing</>
												: <><Icon name='edit' className='icon'/>Edit</>
										}
									</Button>
								}
								{id === authorId && <Button className={'social'} onClick={deleteReply}><Icon name='delete' className='icon'/>Delete</Button>}
								{id && !isEditing && <ReportButton type='comment' contentId={commentId + '#' + replyId} />}
							</div>
						</>
				}
			</div>
		</>
	);
};

export default styled(EditableReplyContent)`

	.button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.actions-bar {
		display: flex;
		align-items: center;
	}

	.reactions {
		display: inline-flex;
		border: none;
		padding: 0.4rem 0;
		margin: 0rem;
	}

	.vl {
		display: inline-flex;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: grey_border;
		height: 2rem;
		margin: 0 1.2rem 0 0.8rem;
	}

	.replyForm {
		margin-top: 2rem;
	}

	.bg-blue-grey{
		background: #EBF0F5 !important;
	}
`;
