// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SwapOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Dropdown } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { useEffect, useState } from 'react';
import { useDiscussionsCountLazyQuery } from 'src/generated/graphql';
import { sortValues } from 'src/global/sortOptions';

import DiscussionListingContainer from './DiscussionListingContainer';

const DiscussionsContainer = ({ className } : { className?:string }) => {
	const [sortBy, setSortBy] = useState<string>(sortValues.COMMENTED);

	const [refetch, { data: discussionsData }] = useDiscussionsCountLazyQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	const handleSortByClick = ({ key }: { key:string }) => {
		setSortBy(key);
	};

	const sortByOptions: ItemType[] = [
		{
			key: sortValues.COMMENTED,
			label: 'Last Commented'
		},
		{
			key: sortValues.NEWEST,
			label: 'Date Added (Newest)'
		},
		{
			key: sortValues.OLDEST,
			label: 'Date Added (Oldest)'
		}
	];

	const sortByDropdown = (
		<Dropdown
			menu={{
				defaultSelectedKeys: [sortValues.COMMENTED],
				items: sortByOptions,
				onClick: handleSortByClick,
				selectable: true
			}}
			trigger={['click']}>
			<div className='dropdown-div flex items-center cursor-pointer hover:text-pink_primary py-1 px-2 rounded'>
				<span className='mr-2'>Sort By</span>
				<SwapOutlined rotate={90} style={ { fontSize: '14px' } } />
			</div>
		</Dropdown>);

	return (
		<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
			<div className='flex items-center justify-between'>
				<h1 className='dashboard-heading'>{ discussionsData?.posts_aggregate.aggregate?.count } Discussions</h1>
				{sortByDropdown}
			</div>

			<DiscussionListingContainer sortBy={sortBy} count={discussionsData?.posts_aggregate.aggregate?.count} className='mt-6' />
		</div>
	);
};

export default styled(DiscussionsContainer)`
	.ant-dropdown-trigger.ant-dropdown-open {
		color: pink_primary !important;
	}
`;