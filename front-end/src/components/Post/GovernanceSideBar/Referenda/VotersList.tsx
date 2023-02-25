// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DislikeFilled, LeftOutlined, LikeFilled, RightOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import { Pagination, PaginationProps, Segmented, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { subscanApiHeaders } from 'src/global/apiHeaders';
import { LoadingStatusType } from 'src/types';
import Address from 'src/ui-components/Address';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

interface Props {
	className?: string
	referendumId: number
}

const VotersList = ({ className, referendumId } : Props) => {
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const [votersList, setVotersList] = useState<any | null>(null);
	const [count, setCount] = useState<number | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [showAyes, setShowAyes] = useState(true);

	const fetchVotersList = useCallback(() => {
		setLoadingStatus({
			isLoading: true,
			message: 'Loading Data'
		});

		fetch(`https://${NETWORK}.api.subscan.io/api/scan/democracy/votes`,
			{
				body: JSON.stringify({
					page: currentPage,
					referendum_index: referendumId,
					row: 10
				}),
				headers: subscanApiHeaders,
				method: 'POST'
			}).then(async (res) => {
			const votersData = await res.json();

			if(votersData && votersData.data && votersData.data.list) {
				if(!count) {
					setCount(votersData.data.count);
				}
				setVotersList(votersData.data.list);
			}

			setLoadingStatus({
				isLoading: false,
				message: 'Loading Data'
			});
		}).catch((err) => {
			console.error('Error in fetching vote data:', err);
		});
	}, [count, currentPage, referendumId]);

	useEffect(() => {
		fetchVotersList();
	}, [fetchVotersList]);

	const onChange: PaginationProps['onChange'] = page => {
		setCurrentPage(page - 1);
	};

	return (
		<>
			{
				votersList &&
				<GovSidebarCard className={`${className}`}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-4 bg-white z-10">
							<h6 className='dashboard-heading'>Voters</h6>
						</div>

						<div className="w-full flex items-center justify-center mb-8">
							<Segmented
								block
								className='px-3 py-2 rounded-md w-full'
								size="large"
								defaultValue={showAyes ? 'ayes' : 'nays'}
								onChange={(value) => setShowAyes(value === 'ayes')}
								options={[
									{
										icon: <LikeFilled />,
										label: 'Ayes',
										value: 'ayes'
									},
									{
										icon: <DislikeFilled />,
										label: 'Nays',
										value: 'nays'
									}
								]}
							/>
						</div>

						<div className='flex flex-col text-xs xl:text-sm xl:max-h-screen gap-y-1 overflow-y-auto px-0 text-sidebarBlue'>
							<div className='flex text-xs items-center justify-between mb-9 font-semibold'>
								<div className='w-[110px]'>Voter</div>
								<div className='w-[60px]'><span className='hidden md:inline-block'>Amount</span><span className='inline-block md:hidden'>Amt.</span></div>
								<div className='w-[70px]'>Conviction</div>
								<div className='w-[30px]'>Vote</div>
							</div>

							{votersList.filter((voteData: any) => voteData.passed === showAyes).map((voteData: any, index:number) =>
								<div className='flex items-center justify-between mb-9' key={index}>
									<div className='w-[110px] max-w-[110px] overflow-ellipsis'>
										<Address textClassName='w-[75px]' displayInline={true} address={voteData.account.address} />
									</div>

									<div className='w-[80px] max-w-[80px] overflow-ellipsis'>{formatBnBalance(voteData.amount, { numberAfterComma: 2, withUnit: true })}</div>

									<div className='w-[50px] max-w-[50px] overflow-ellipsis'>{voteData.conviction}x</div>

									{voteData.passed ?
										<div className='flex items-center text-aye_green text-md w-[20px] max-w-[20px]'>
											<LikeFilled className='mr-2' />
										</div>
										:
										<div className='flex items-center text-nay_red text-md w-[20px] max-w-[20px]'>
											<DislikeFilled className='mr-2' />
										</div>
									}
								</div>
							)}
						</div>

						<div className="flex justify-center pt-6 bg-white z-10">
							<Pagination
								size="small"
								defaultCurrent={1}
								onChange={onChange}
								total={count}
								showSizeChanger={false}
								pageSize={10}
								responsive={true}
								hideOnSinglePage={true}
								nextIcon={<div className='-mt-1 ml-1'><RightOutlined /></div>}
								prevIcon={<div className='-mt-1 mr-1'><LeftOutlined className='-mt-10' /></div>}
							/>
						</div>
					</Spin>
				</GovSidebarCard>
			}
		</>
	);
};

export default VotersList;