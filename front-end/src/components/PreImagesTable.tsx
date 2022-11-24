// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ProfileOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { useFetch } from 'src/hooks';
import NameLabel from 'src/ui-components/NameLabel';
import { ErrorState, LoadingState, PostEmptyState } from 'src/ui-components/UIStates';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

const NETOWRK = getNetwork();

const PreImagesTable = () => {
	const [modalArgsRow, setModalArgsRow] = useState<any>(null);

	const { data, error } = useFetch<any>(
		`https://${NETOWRK}.polkassembly.io/v1/graphql`,
		{
			body: JSON.stringify({
				query: `query GetPreimagesV2{
						preimageV2s {
								author
								depositAmount
								enactmentPeriod
								hash
								id
								length
								metaDescription
								method
								origin
								preimageArguments {
								id
								name
								value
								}
								preimageStatus {
										id
										status
										blockNumber {
												number
												id
										}
								}
								section
						}
				}`
			}),
			method: 'POST'
		}
	);

	const columns: ColumnsType<any> = [
		{
			title: 'Hash',
			dataIndex: 'hash',
			key: 'hash',
			width: 350,
			render: (hash) => <span className='text-sidebarBlue font-medium'>{hash}</span>
		},
		{
			title: 'Author',
			dataIndex: 'author',
			key: 'author',
			width: 200,
			render: (author) => <NameLabel defaultAddress={author} />
		},
		{
			title: 'Deposit',
			dataIndex: 'depositAmount',
			key: 'depositAmount',
			width: 120,
			render: (depositAmount) => <span className='text-sidebarBlue font-medium whitespace-pre'>{depositAmount && formatBnBalance(depositAmount, { numberAfterComma: 2, withUnit: true })}</span>
		},
		{
			title: 'Arguments',
			dataIndex: 'section',
			key: 'section',
			width: 265,
			render: (section, rowData) => section && rowData.method && <div className='flex items-center'>
				<code className='px-2 rounded-md'>{section}.{rowData.method}</code>
				{rowData.preimageArguments && rowData.preimageArguments.length && <ProfileOutlined className='ml-2 p-1 text-base rounded-md hover:text-pink_primary cursor-pointer' onClick={() => setModalArgsRow(rowData)} />}
			</div>
		},
		{
			title: 'Size',
			dataIndex: 'length',
			key: 'length',
			width: 65,
			render: (length) => <span className='text-sidebarBlue font-medium'>{length}</span>
		},
		{
			title: 'Status',
			dataIndex: 'preimageStatus',
			key: 'preimageStatus',
			width: 135,
			render: (preimageStatus) => <span className='text-sidebarBlue font-medium'>{ preimageStatus && preimageStatus[0].status == 'Noted' ? 'Unrequested' : preimageStatus[0].status }</span>
		}
	];

	if (error?.message) return <ErrorState errorMessage={'Error in loading data, please try again.'} />;

	if(data) {
		if(!data.data.preimageV2s || !data.data.preimageV2s.length) return <PostEmptyState />;

		const tableData: any[] = [];

		data.data.preimageV2s.forEach((preImageObj: any) => {
			tableData.push({ key:preImageObj.hash, ...preImageObj });
		});

		return (
			<div>
				<Table
					columns={columns}
					dataSource={tableData}
					pagination={false}
					scroll={{ x: 1000 }}
				/>

				<Modal
					open={Boolean(modalArgsRow)}
					title={'Arguments'}
					onOk={() => setModalArgsRow(null)}
					onCancel={() => setModalArgsRow(null)}
					footer={[
						<Button key="back" onClick={() => setModalArgsRow(null)}> Close </Button>
					]}
				>
					{modalArgsRow && modalArgsRow.preimageArguments && modalArgsRow.preimageArguments.length &&
					<div className='w-full max-h-[60vh] overflow-auto'>
						<ReactJson
							src={modalArgsRow.preimageArguments}
							iconStyle='circle'
							enableClipboard={false}
							displayDataTypes={false}
						/>
					</div>}
				</Modal>
			</div>
		);
	}

	// Loading state
	return <LoadingState />;
};

export default React.memo(PreImagesTable);