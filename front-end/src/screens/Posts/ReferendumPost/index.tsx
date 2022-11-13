// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useReferendumPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

const ReferendumPost = ({ councilBoardSidebar=false, postID }:{ councilBoardSidebar?: boolean, postID?: number }) => {
	const { id } = useParams();
	const idNumber = Number(id) || Number(postID) || 0;

	const [getData, { called, data, error, refetch }] = useReferendumPostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		{!councilBoardSidebar && <BackToListingView postCategory={PostCategory.REFERENDA} />}

		<div className='mt-6'>
			<Post data={data} isReferendum refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default ReferendumPost;
