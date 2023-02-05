// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LeftOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useFellowshipReferendumPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

interface Props {
	postID?: number;
	trackName?: string;
}

const MemberReferendumPost = ({ postID }: Props) => {
	const { id } = useParams();
	const idNumber = Number(id) || Number(postID) || 0;

	const [getData, { called, data, error, refetch }] = useFellowshipReferendumPostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) {
		const trackName = data?.posts[0]?.onchain_link?.origin || '';

		return (<div>
			<Link className='text-sidebarBlue hover:text-pink_primary' to={'/member-referenda'}>
				<div className='flex items-center'>
					<LeftOutlined className='text-xs mr-2' />
					<span className='text-sm font-medium'>Back to Member Referenda</span>
				</div>
			</Link>

			<div className='mt-6'>
				<Post data={data} trackName={trackName} isFellowshipReferendum refetch={refetch} />
			</div>
		</div>);
	}
	return <div className='mt-16'><LoadingState /></div>;
};

export default MemberReferendumPost;
