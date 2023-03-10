// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable */
import {
	DislikeFilled,
	LikeFilled
} from '@ant-design/icons';
import { Pagination, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subsquidApiHeaders } from 'src/global/apiHeaders';

// import { Link } from 'react-router-dom';
import FilteredError from '../../ui-components/FilteredError';
// import HelperTooltip from '../../ui-components/HelperTooltip';
import Loader from '../../ui-components/Loader';
import getNetwork from '../../util/getNetwork';

interface Props {
  address: string;
  className?: string;
}

interface SUBSQUID_LINKS_TYPE {
  [network: string]: string;
}

const SUBSQUID_LINKS: SUBSQUID_LINKS_TYPE = {
	kusama: 'https://squid.subsquid.io/kusama-polkassembly/v/v2/graphql',
	polkadot: 'https://squid.subsquid.io/polkassembly-polkadot/v/v1/graphql'
};

const NETWORK = getNetwork();

const CouncilVotes = ({ className, address }: Props) => {
	const [offset, setOffset] = useState<number>(0);
	const [total, setTotal ] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>();
	const [error, setError] = useState<Error | null>(null);

	const fetchVotesData = useCallback(() => {
		setLoading(true);
		fetch(`${SUBSQUID_LINKS[NETWORK]}`, {
			body: JSON.stringify({
				query: `query MyQuery {
  							votes(orderBy: blockNumber_DESC, where: {voter_eq: "${address}"}, limit: ${10}, offset: ${0}) {
    							id
    							blockNumber
    							decision
    							proposal {
      								index
      								hash
    							}
  							}
  						votesConnection(where: {voter_eq: "${address}"}, orderBy: blockNumber_DESC) {
    						totalCount
  					}
				}`
			}),
			headers: subsquidApiHeaders,
			method: 'POST'
		})
			.then(async (res) => {
				const response = await res.json();
				setData(response?.data?.votes);
				setTotal(response?.data?.voteComplete?.totalCount)
			})
			.catch((err) => {
				setError(err);
				console.log('Error in fetching:', err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [address, offset]);

	useEffect(() => {
		fetchVotesData();
	}, [fetchVotesData, offset]);

	const columns: ColumnsType<any> = [
		{
			dataIndex: 'proposal',
			key: 'proposal',
			render: (proposal) => (
				<Link to={`/motion/${proposal?.index}`}>
					<h3>
            Motion <div id={proposal?.index}></div>
					</h3>
				</Link>
			),
			title: 'Proposals'
		},
		{
			dataIndex: 'blockNumber',
			key: 'blockNumber',
			render: (blockNumber) => (
				<a href={`https://${NETWORK}.subscan.io/block/${blockNumber}`}>
					<h6>#{blockNumber}</h6>
				</a>
			),
			title: 'Block'
		},
		{
			dataIndex: 'decision',
			key: 'decision',
			render: (decision) => (
				<>
					{decision === 'yes' ? (
						<div className="flex items-center">
							<LikeFilled className="text-green_primary" />{' '}
							<span className="text-green_primary ml-2">Aye</span>
						</div>
					) : (
						<div className="flex items-center">
							<DislikeFilled className="text-red_primary" />{' '}
							<span className="text-red_primary ml-2">Nay</span>
						</div>
					)}
				</>
			),
			title: 'Vote'
		}
	];

	const handlePagination = () => {
		if(loading) return;		
	}

	return (
		<div className={`${className} p-3 lg:p-6 `}>
			{/* <div className='dashboard-heading mb-4'>Voting History <HelperTooltip className='align-middle ml-3' text='This represents the onchain votes of council member'/></div> */}
			<div>
				{loading ? <Loader text={'Loading...'} /> : null}
				{error ? <FilteredError text={error.message} /> : null}
				{data?.length ? <Table dataSource={data} columns={columns} pagination={false} /> : null}
			</div>

			<div className='flex justify-end mt-6'>
				<Pagination 
					defaultCurrent={1}
					pageSize={20}
					total={total} 
					showSizeChanger={false}
					hideOnSinglePage={true} 
					onChange={handlePagination} 
					responsive={true}
				/>
			</div>
		</div>
	);
};

const Container = ({ address }: { address: string }) => {
	return <CouncilVotes address={address} />;
};

export default Container;
