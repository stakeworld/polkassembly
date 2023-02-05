// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { useGetLatestGov2FellowshipPostsLazyQuery } from 'src/generated/graphql';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';

interface Props {
	className?: string;
	trackName?: string;
}

const FellowshipListingAllTabContent = ({ className } : Props) => {

	const [getData, { called, data, error, loading, refetch }] = useGetLatestGov2FellowshipPostsLazyQuery({
		variables : {
			limit: 10
		}
	});

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if(error) return <div className={className}><ErrorAlert errorMsg={error.message} /></div>;

	if(!data || loading) return <div className={className}><LoadingState /></div>;
	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentReferendum = data.posts.some((post) => {
		if(post.onchain_link?.onchain_fellowship_referendum.length){
			// this breaks the loop as soon as
			// we find a post that has a tip.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentReferendum) return <div className={className}><PostEmptyState /></div>;
	return (
		<div className={`${className} proposals__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_fellowship_referendum[0]?.referendumId;

					return !!post?.author?.username && !!post?.onchain_link?.onchain_fellowship_referendum.length &&
						<div key={post.id} className='my-5'>
							{<Link to={`/member-referenda/${onchainId}`}>
								<GovernanceCard
									postReactions={(post as any)?.post_reactions}
									address={post.onchain_link.onchain_fellowship_referendum[0]?.submitted.who}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: '0'}
									method={post.onchain_link.onchain_fellowship_referendum[0]?.preimage?.method}
									onchainId={onchainId}
									status={post.onchain_link.onchain_fellowship_referendum[0]?.referendumStatus?.[0].status}
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

export default FellowshipListingAllTabContent;