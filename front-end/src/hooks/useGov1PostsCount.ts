// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import { useBountiesCountLazyQuery, useDemocracyProposalCountLazyQuery, useDemocracyTreasuryProposalCountLazyQuery, useDiscussionsCountLazyQuery, useGetLatestMotionsCountLazyQuery, usePostsCountLazyQuery, useReferundumCountLazyQuery, useTipProposalCountLazyQuery } from 'src/generated/graphql';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';

type Response = {
	allPostsCount: string;
	discussionsCount: string;
	proposalsCount: string;
	referendaCount: string;
	motionsCount: string;
	treasuryCount: string;
	bountiesCount: string;
	tipsCount: string;
}

const initResponse: Response = {
	allPostsCount: '',
	bountiesCount: '',
	discussionsCount: '',
	motionsCount: '',
	proposalsCount: '',
	referendaCount: '',
	tipsCount: '',
	treasuryCount: ''
};

const useGov1PostsCount = () => {
	const [response, setResponse] = useState<Response>(initResponse);

	const [getPostsCountData, { called: postsCountCalled, data: postsCountData, refetch: postsCountRefetch }] = usePostsCountLazyQuery();
	const [getDiscussionCountData, { called: discussionCountCalled, data: discussionCountData, refetch: discussionCountRefetch }] = useDiscussionsCountLazyQuery();
	const [getReferundumCountData, { called: referundumCountCalled, data: referundumCountData, refetch: referundumCountRefetch }] = useReferundumCountLazyQuery({
		variables: {
			postType: post_type.ON_CHAIN
		}
	});

	const [getDemocracyProposalCountData, { called: democracyProposalCountCalled, data: democracyProposalCountData, refetch: democracyProposalCountRefetch }] = useDemocracyProposalCountLazyQuery({ variables: {
		postTopic: post_topic.DEMOCRACY,
		postType: post_type.ON_CHAIN
	} });

	const [getLatestMotionsCountData, { called: latestMotionsCountCalled, data: latestMotionsCountData, refetch: latestMotionsCountRefetch }] = useGetLatestMotionsCountLazyQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	const [getDemocracyTreasuryProposalCountData, { called: democracyTreasuryProposalCountCalled, data: democracyTreasuryProposalCountData, refetch: democracyTreasuryProposalCountRefetch }] = useDemocracyTreasuryProposalCountLazyQuery({ variables: {
		postTopic: post_topic.TREASURY,
		postType: post_type.ON_CHAIN
	} });

	const [getBountiesCountData, { called: bountiesCountCalled, data: bountiesCountData, refetch: bountiesCountRefetch }] = useBountiesCountLazyQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	const [getTipProposalCountData, { called: tipProposalCountCalled, data: tipProposalCountData, refetch: tipProposalCountRefetch }] = useTipProposalCountLazyQuery({ variables: {
		postTopic: post_topic.TREASURY,
		postType: post_type.ON_CHAIN
	} });

	useEffect(() => {
		postsCountCalled ? postsCountRefetch() : getPostsCountData();
		discussionCountCalled ? discussionCountRefetch() : getDiscussionCountData();
		referundumCountCalled ? referundumCountRefetch() : getReferundumCountData();
		democracyProposalCountCalled ? democracyProposalCountRefetch() : getDemocracyProposalCountData();
		latestMotionsCountCalled ? latestMotionsCountRefetch() : getLatestMotionsCountData();
		democracyTreasuryProposalCountCalled ? democracyTreasuryProposalCountRefetch() : getDemocracyTreasuryProposalCountData();
		bountiesCountCalled ? bountiesCountRefetch() : getBountiesCountData();
		tipProposalCountCalled ? tipProposalCountRefetch() : getTipProposalCountData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postsCountCalled, discussionCountCalled, referundumCountCalled, democracyProposalCountCalled, latestMotionsCountCalled, democracyTreasuryProposalCountCalled, bountiesCountCalled, tipProposalCountCalled]);

	useEffect(() => {
		setResponse({
			...response,
			allPostsCount: `${postsCountData?.posts_aggregate.aggregate?.count || ''}`,
			bountiesCount: `${bountiesCountData?.posts_aggregate.aggregate?.count || ''}`,
			discussionsCount: `${discussionCountData?.posts_aggregate.aggregate?.count || ''}`,
			motionsCount: `${latestMotionsCountData?.posts_aggregate.aggregate?.count || ''}`,
			proposalsCount: `${democracyProposalCountData?.posts_aggregate.aggregate?.count || ''}`,
			referendaCount: `${referundumCountData?.posts_aggregate.aggregate?.count || ''}`,
			tipsCount: `${tipProposalCountData?.posts_aggregate.aggregate?.count || ''}`,
			treasuryCount: `${democracyTreasuryProposalCountData?.posts_aggregate.aggregate?.count || ''}`
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postsCountData, discussionCountData, referundumCountData, democracyProposalCountData, latestMotionsCountData, democracyTreasuryProposalCountData, bountiesCountData, tipProposalCountData]);

	return response;
};

export default useGov1PostsCount;