// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { GetLatestMotionPostsQuery } from 'src/generated/graphql';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';

interface Props {
  className?: string
  data?: GetLatestMotionPostsQuery
	loading?: boolean
}

const MotionsListing = ({ className, data, loading } : Props) => {
	if(!data || loading) return <div className={className}><LoadingState /></div>;

	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentMotion = data.posts.some((post) => {
		if(post.onchain_link?.onchain_motion.length){
			// this breaks the loop as soon as
			// we find a post that has a motion.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentMotion) return <div className={className}><PostEmptyState /></div>;

	return (
		<div className={`${className} motions__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_motion_id;

					return !!post?.author?.username && !!post.onchain_link?.onchain_motion.length &&
						<div key={post.id} className='my-5'>
							{<Link to={`/motion/${onchainId}`}>
								<GovernanceCard
									postReactions={(post as any)?.post_reactions}
									address={post.onchain_link.proposer_address}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: '0'}
									method={post.onchain_link.onchain_motion[0]?.preimage?.method}
									onchainId={onchainId}
									status={post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status}
									title={post.title}
									topic={post.topic.name}
									created_at={post.created_at}
								/>
							</Link>}
						</div>
					;
				}
			)}
		</div>
	);
};

export default MotionsListing;