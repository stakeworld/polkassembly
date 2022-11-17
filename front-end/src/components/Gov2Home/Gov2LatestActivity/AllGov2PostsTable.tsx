// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestGov2PostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { EmptyLatestActivity, ErrorLatestActivity, Gov2PopulatedLatestActivityCard, LoadingLatestActivity, PopulatedLatestActivity } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getDefaultAddressField from 'src/util/getDefaultAddressField';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface AllPostsRowData {
  key: string | number;
	id: number;
  title: string;
	subTitle: string | null;
  address?: string;
	username: string;
  postOrigin: string | null;
	status: string | null;
	createdAt: string | null;
	track: number | null;
}

const columns: ColumnsType<AllPostsRowData> = [
	{
		title: '#',
		dataIndex: 'id',
		key: 'id',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 350,
		fixed: 'left',
		render: (title, { subTitle }) => {
			return (
				<>
					<h4>
						<div>
							{title}
						</div>
					</h4>
					{subTitle && <div className='text-sm text-sidebarBlue'>{subTitle}</div>}
				</>
			);
		}
	},
	{
		title: 'Posted By',
		dataIndex: 'username',
		key: 'postedBy',
		render: (username, { address }) => <NameLabel defaultAddress={address} username={username} disableIdenticon={true} />
	},
	{
		title: 'Created',
		key: 'created',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = getRelativeCreatedAt(createdAt);
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			if(status) return <StatusTag status={status} />;
		}
	},
	{
		title: 'Origin',
		dataIndex: 'postOrigin',
		key: 'type',
		render: (postOrigin) => {
			return (
				<span className='flex items-center'>
					<span className='capitalize ml-3'>{postOrigin?.split(/(?=[A-Z])/).join(' ')}</span></span>
			);
		}
	}
];

const defaultAddressField = getDefaultAddressField();

const AllGov2PostsTable = () => {
	const navigate = useNavigate();

	function gotoPost(rowData: AllPostsRowData){
		navigate(`/${rowData.postOrigin}/${rowData.track}/${rowData.id}`);
	}

	const [getData, { called, data, error, refetch }] = useGetLatestGov2PostsLazyQuery({
		variables: {
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

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		if(!data.posts || !data.posts.length) return <EmptyLatestActivity />;

		const tableData: AllPostsRowData[] = [];

		data.posts.forEach(post => {

			if(post && post?.author?.username) {
				// truncate title
				let title = post.title || post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));
				const subTitle = !title && post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method ? post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method : null;

				const tableDataObj:AllPostsRowData = {
					key: post.id,
					id: !isNaN(Number(post.onchain_link?.onchain_referendumv2[0]?.id)) ? Number(post.onchain_link?.onchain_referendumv2[0]?.id) : post.id,
					title,
					subTitle,
					address: post.onchain_link?.proposer_address ? post.onchain_link?.proposer_address : post.author[defaultAddressField]!,
					username: post.author.username,
					createdAt: post.created_at,
					postOrigin: post.onchain_link?.origin || null,
					status: post.onchain_link?.onchain_referendumv2?.[0]?.referendumStatus?.[0].status || null,
					track: Number(post.onchain_link?.onchain_referendumv2?.[0]?.trackNumber)
				};

				tableData.push(tableDataObj);
			}
		});

		return (
			<>
				<div className='hidden lg:block'>
					<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>

				<div className="block lg:hidden h-[520px] overflow-y-auto">
					<Gov2PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>
			</>
		);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default AllGov2PostsTable;