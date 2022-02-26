// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useContext } from 'react';
import { Popup } from 'semantic-ui-react';
import { ReactionMapFields } from 'src/types';

import { UserDetailsContext } from '../../context/UserDetailsContext';
import {
	CommentReactionsQuery,
	PostReactionsQuery,
	useAddCommentReactionMutation,
	useAddPostReactionMutation,
	useDeleteCommentReactionMutation,
	useDeletePostReactionMutation } from '../../generated/graphql';
import Button from '../../ui-components/Button';

export interface ReactionButtonProps {
	className?: string
	reaction: string
	reactionMap:  { [ key: string ]: ReactionMapFields; }
	postId?: number
	commentId?: string
	refetch?: (variables?: undefined) => Promise<ApolloQueryResult<PostReactionsQuery>>
		| Promise<ApolloQueryResult<CommentReactionsQuery>>
}

const ReactionButton = function ({
	className,
	reaction,
	reactionMap,
	postId,
	commentId,
	refetch
}: ReactionButtonProps) {
	const { id, username } = useContext(UserDetailsContext);
	const [addPostReactionMutation] = useAddPostReactionMutation();
	const [addCommentReactionMutation] = useAddCommentReactionMutation();
	const [deletePostReactionMutation] = useDeletePostReactionMutation();
	const [deleteCommentReactionMutation] = useDeleteCommentReactionMutation();
	const userNames = reactionMap[reaction].userNames;
	const reacted = username && userNames.includes(username);

	const _refetch = () => { refetch && refetch(); };

	//returns string array of other-reactions by the user
	const otherReactions = () : string[] => {
		const otherReactions: string[] = [];

		if(!username) return otherReactions;

		for (const reactionKey of Object.keys(reactionMap)) {
			if(reactionMap[reactionKey].userNames.includes(username)){
				otherReactions.push(reactionKey);
			}
		}

		return otherReactions;
	};

	const handleReact = () => {
		if (!id) {
			console.error('No user id found. Not logged in?');
			return;
		}

		if (postId) {
			if (reacted) {
				deletePostReactionMutation({
					variables: {
						postId,
						reaction,
						userId: id
					}
				})
					.then(_refetch)
					.catch((e) => console.error('Error in reacting to content',e));
			} else {
				// check if user reacted to other-reactions
				const otherReactionsArr = otherReactions();
				if(otherReactionsArr.length > 0){
					//if reacted, delete that other-reactions
					const delReactionPromiseArr = otherReactionsArr.map((reactionToDel) => deletePostReactionMutation({
						variables: {
							postId,
							reaction: reactionToDel,
							userId: id
						}
					}));

					Promise.all(delReactionPromiseArr)
						.then(_refetch)
						.catch((e) => console.error('Error in reacting to content', e));
				}

				//add new reaction
				addPostReactionMutation({
					variables: {
						postId,
						reaction,
						userId: id
					}
				})
					.then(_refetch)
					.catch((e) => console.error('Error in reacting to content',e));
			}
		}

		if (commentId) {
			if (reacted) {
				deleteCommentReactionMutation({
					variables: {
						commentId,
						reaction,
						userId: id
					}
				})
					.then(_refetch)
					.catch((e) => console.error('Error in reacting to content',e));
			} else {
				// check if user reacted to other-reaction option
				const otherReactionsArr = otherReactions();
				if(otherReactionsArr.length > 0){
					//if reacted, delete that other-reaction

					const delReactionPromiseArr = otherReactionsArr.map((reactionToDel) => deleteCommentReactionMutation({
						variables: {
							commentId,
							reaction: reactionToDel,
							userId: id
						}
					}));

					Promise.all(delReactionPromiseArr)
						.then(_refetch)
						.catch((e) => console.error('Error in reacting to content', e));
				}

				//add new reaction
				addCommentReactionMutation({
					variables: {
						commentId,
						reaction,
						userId: id
					}
				})
					.then(_refetch)
					.catch((e) => console.error('Error in reacting to content',e));
			}
		}
	};

	let popupContent = '';

	if (userNames.length > 5) {
		popupContent = `${userNames.slice(0, 5).join(', ')} and ${userNames.length - 5} others`;
	} else {
		popupContent = userNames.join(', ');
	}

	const button =  <span className={className}>
		<Button
			className={'social' + (reacted ? ' reacted' : '')}
			onClick={handleReact}
			disabled={!id}
		>
			{reaction} {reactionMap[reaction].count}
		</Button>
	</span>;

	return userNames.length > 0 ?
		<Popup
			content={popupContent}
			trigger={button}
		/> : button;
};

export default styled(ReactionButton)`
	.social {
		color: blue_primary !important;
		font-size: 1em !important;
	}

	.reacted {
		background-color: blue_secondary !important;
		border: none !important;
	}
`;
