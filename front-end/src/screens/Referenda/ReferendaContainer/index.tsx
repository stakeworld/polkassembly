// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'semantic-ui-react';
import { post_type } from 'src/global/post_types';
import PaginationDiv from 'src/ui-components/PaginationDiv';

import Referenda from '../../../components/Listings/ReferendaListing';
import { useAllReferendaPostsQuery, useReferundumCountQuery } from '../../../generated/graphql';
import FilteredError from '../../../ui-components/FilteredError';
import Loader from '../../../ui-components/Loader';

interface Props {
	className?: string
	limit: number
}

const ReferendaContainer = ({ className, limit }:Props) => {
	const [page, setPage] = useState(1);
	const [offset, setOffset] = useState(0);

	const { data, error, loading, refetch } = useAllReferendaPostsQuery({ variables: {
		limit,
		offset,
		postType: post_type.ON_CHAIN
	} });

	const { data: countData, loading:countLoading, refetch:countRefetch } = useReferundumCountQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		countRefetch();
	}, [countRefetch]);

	const handlePaginationChange = (event: any, { activePage }: PaginationProps) => {
		const nextPage = Math.ceil(Number(activePage));
		setPage(nextPage);
		setOffset(Math.ceil(limit * (nextPage - 1)));
	};

	if (error?.message) return <FilteredError text={error.message}/>;

	if (data) return (
		loading ? <div style={{ marginTop: '20rem' }}><Loader /></div> :
			<>
				<Referenda className={className} data={data}/>
				{
					!countLoading && countData?.posts_aggregate.aggregate?.count &&
				countData?.posts_aggregate.aggregate?.count > 0 && countData?.posts_aggregate.aggregate?.count > limit &&
				<PaginationDiv
					page={page}
					totalPostsCount={countData.posts_aggregate.aggregate.count}
					limit={limit}
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

export default ReferendaContainer;
