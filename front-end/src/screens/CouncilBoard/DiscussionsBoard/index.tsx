// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { useDiscussionPostsIdDescQuery, useDiscussionsCountQuery } from 'src/generated/graphql';

import DiscussionPostCard from './DiscussionPostCard';

interface Props {
	className?: string
	openSidebar: (postID: number) => void
}

const DiscussionsBoard = ({ className, openSidebar } : Props) => {
	const { data, error, loading, refetch } = useDiscussionPostsIdDescQuery({ variables: { limit: 10 } });
	const { data: discussionsCount, refetch: discussionsCountRefetch } = useDiscussionsCountQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		discussionsCountRefetch();
	}, [discussionsCountRefetch]);

	return (
		<div className={className}>
			{!loading && error && <h3>Error fetching discussions</h3>}

			<h3>Discussions {discussionsCount && <span className='card-count'>{discussionsCount.posts_aggregate.aggregate?.count}</span>}</h3>
			{
				!loading && !error && data?.posts && data.posts.length > 0 &&
				data.posts.map(post => {
					return !!post?.author?.username &&
					<div key={post.id} className='post-card-div' onClick={() => openSidebar(post.id)}>
						<DiscussionPostCard
							title={post.title}
							content={'Working on finishing up the tickets for the bigger project files. Working on finishing up the tickets for'}
							username={post.author.username}
							commentsCount={post.comments_aggregate.aggregate?.count}
							createdAt={post.created_at}
						/>
					</div>;
				})
			}
		</div>
	);
};

export default styled(DiscussionsBoard)``;