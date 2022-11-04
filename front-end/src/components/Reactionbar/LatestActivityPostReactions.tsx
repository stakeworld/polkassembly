// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';

import { usePostReactionsQuery } from '../../generated/graphql';
import { ReactionMapFields } from '../../types';
import CommentButton from './CommentButton';
import ReactionButton from './ReactionButton';
import { reactions } from './reactions';

interface Props {
	className?: string
	postId: number,
	gotoPost: () => void
}

const LatestActivityPostReactions = function ({ className, postId, gotoPost }: Props) {
	const { data, refetch } = usePostReactionsQuery({ variables: { postId } });
	const [reactionsDisabled, setReactionsDisabled] = useState<boolean>(false);

	const reactionMap: { [ key: string ]: ReactionMapFields; } = {};

	reactions.forEach((reaction) => {
		reactionMap[reaction] = {
			count: 0,
			userNames: []
		};
	});

	data?.post_reactions?.forEach(({ reaction, reacting_user }) => {
		if (!reactionMap[reaction]) {
			return;
		}

		if (reacting_user?.username && reactionMap[reaction].userNames.includes(reacting_user?.username)){
			console.error('This user has already reacted.');
			return;
		}

		if (reacting_user?.username) {
			reactionMap[reaction].userNames.push(reacting_user?.username);
		}

		reactionMap[reaction].count++;
	});

	return (
		<div className={className}>
			<ReactionButton
				isLatestActivity={true}
				reaction={reactions[0]}
				reactionMap={reactionMap}
				postId={postId}
				refetch={refetch}
				reactionsDisabled={reactionsDisabled}
				setReactionsDisabled={setReactionsDisabled}
			/>

			<CommentButton
				postId={postId}
				gotoPost={gotoPost}
				reactionsDisabled={reactionsDisabled}
			/>
		</div>
	);
};

export default LatestActivityPostReactions;
