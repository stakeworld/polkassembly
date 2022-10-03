// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import PaginationDiv from 'src/ui-components/PaginationDiv';
import paginationChange from 'src/util/paginationChange';

import DiscussionsListing from '../../components/Listings/DiscussionsListing';
import { useDiscussionPostsIdAscQuery, useDiscussionPostsIdDescQuery, useDiscussionsCountQuery, useLatestDiscussionPostsQuery } from '../../generated/graphql';
import { sortValues } from '../../global/sortOptions';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

const LIMIT = 20;

interface Props {
	sortBy?: string
}

const DiscussionsContainer = ({ sortBy }: Props) => {
	const [page, setPage] = useState(1);
	const [offset, setOffset] = useState(0);

	let postsQuery: typeof useDiscussionPostsIdDescQuery | typeof useDiscussionPostsIdAscQuery | typeof useLatestDiscussionPostsQuery;

	if (sortBy === sortValues.NEWEST)
		postsQuery = useDiscussionPostsIdDescQuery;
	else if (sortBy === sortValues.OLDEST) {
		postsQuery = useDiscussionPostsIdAscQuery;
	} else {
		postsQuery = useLatestDiscussionPostsQuery;
	}

	const { data, error, loading, refetch } = postsQuery({ variables: { limit: LIMIT, offset } });

	const { data: countData, loading:countLoading, refetch:countRefetch } = useDiscussionsCountQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		countRefetch();
	}, [countRefetch]);

	const handlePaginationChange = (activePage: string | number | undefined) => {
		paginationChange({ activePage, limit:LIMIT, setOffset, setPage });
	};

	if (error?.message) {
		return <FilteredError text={error.message}/>;
	}

	if (loading) {
		return <Loader/>;
	}

	if (data) return (
		loading ? <div style={{ marginTop: '20rem' }}><Loader /></div> :
			<>
				<DiscussionsListing data={data} />
				{
					!countLoading && countData?.posts_aggregate.aggregate?.count &&
				countData?.posts_aggregate.aggregate?.count > 0 && countData?.posts_aggregate.aggregate?.count > LIMIT &&
				<PaginationDiv
					page={page}
					totalPostsCount={countData.posts_aggregate.aggregate.count}
					limit={LIMIT}
					handlePaginationChange={handlePaginationChange}
					disabled={loading}
					offset={offset}
					currDataLength={data.posts.length}
				/>
				}
			</>
	);

	return <Loader/>;

};

export default DiscussionsContainer;
