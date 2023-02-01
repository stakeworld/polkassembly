// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LeftOutlined, LikeFilled, RightOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { subsquidApiHeaders } from 'src/global/apiHeaders';
import Address from 'src/ui-components/Address';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';
import formatBnBalance from 'src/util/formatBnBalance';

/* eslint-disable sort-keys */
interface Props {
	className?: string
	referendumId: number
}

const ReferendumV2VoteInfo = ({ className, referendumId } : Props) => {
	const [offset, setOffset] = useState<number>(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [votesList, setVotesList] = useState<any[] | null>(null);
	const [error, setError] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchVotesData = useCallback(() => {
		setLoading(true);
		// TODO: Change to v2
		fetch('https://squid.subsquid.io/kusama-polkassembly/v/v1/graphql',
			{ body: JSON.stringify({
				query: `query MyQuery {
				convictionVotes(where: {type_eq: ReferendumV2, removedAtBlock_isNull: true proposal: {index_eq: ${referendumId}}}, limit: ${10}, offset: ${offset}, orderBy: id_DESC) {
						type
						balance {
							... on SplitVoteBalance {
								nay
								aye
							}
							... on StandardVoteBalance {
								value
							}
						}
						createdAtBlock
						decision
						id
						lockPeriod
						proposalId
						createdAt
						voter
						proposal {
							index
						}
					}
				}`
			}),
			headers: subsquidApiHeaders,
			method: 'POST'
			})
			.then(async (res) => {
				const response = await res.json();
				if(response && response.data && response.data.convictionVotes) {
					const votesData = response.data.convictionVotes;
					setVotesList(votesData);
				}
			}).catch((err) => {
				setError(err);
				console.log('Error in fetching voters :', err);
			}).finally(() => {
				setLoading(false);
			});
	}, [offset, referendumId]);

	useEffect(() => {
		fetchVotesData();
	}, [fetchVotesData, offset, referendumId]);

	function handlePagination(navDirection: 'next' | 'prev'){
		if(navDirection == 'prev') {
			if(offset == 0) return;
			if(offset < 20) {
				setOffset(0);
			} else {
				setOffset(offset - (votesList?.length || 0));
			}
		} else {
			if(votesList && votesList?.length < 10) return;
			setOffset(offset + (votesList?.length || 0));
		}
	}

	if(error) return <GovSidebarCard className={className}><ErrorAlert errorMsg='Error in fetching votes, please try again.' /></GovSidebarCard>;

	if(votesList) {

		if(loading) return <GovSidebarCard className={className}><LoadingState /></GovSidebarCard>;

		if(votesList.length > 0) {
			return (
				<GovSidebarCard className={className}>
					<div className="flex justify-between mb-6 bg-white z-10">
						<h6 className='dashboard-heading'>Voters</h6>
					</div>

					<div className='flex flex-col text-xs xl:text-sm xl:max-h-screen gap-y-1 overflow-y-auto px-0 text-sidebarBlue'>
						<div className='flex text-xs items-center justify-between mb-9 font-semibold'>
							<div className='w-[110px]'>Voter</div>
							<div className='w-[60px]'><span className='hidden md:inline-block'>Amount</span><span className='inline-block md:hidden'>Amt.</span></div>
							<div className='w-[70px]'>Conviction</div>
							<div className='w-[30px]'>Vote</div>
						</div>

						{votesList.map((voteData: any, index:number) =>
							voteData.balance.value !== undefined ?
								<div className='flex items-center justify-between mb-9' key={index}>
									<div className='w-[110px] max-w-[110px] overflow-ellipsis'>
										<Address textClassName='w-[90px] text-xs' displayInline={true} address={voteData.voter} />
									</div>

									<div className='w-[80px] max-w-[80px] overflow-ellipsis'>{formatBnBalance(voteData.balance.value, { numberAfterComma: 2, withUnit: true })}</div>

									<div className='w-[50px] max-w-[50px] overflow-ellipsis'>{voteData.lockPeriod}x</div>

									{voteData.decision === 'yes' ?
										<div className='flex items-center text-aye_green text-md w-[20px] max-w-[20px]'>
											<LikeFilled className='mr-2' />
										</div>
										:
										<div className='flex items-center text-nay_red text-md w-[20px] max-w-[20px]'>
											<DislikeFilled className='mr-2' />
										</div>
									}
								</div>
								: <></>
						)}

					</div>

					<div className="flex items-center justify-center pt-6 bg-white z-10">
						<div className={`mr-5 flex items-center ${offset === 0 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('prev')}><LeftOutlined className='mr-1' /> Prev</div>
						<div className={`ml-5  flex items-center ${votesList.length < 10 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('next')}>Next <RightOutlined  className='ml-1' /></div>
					</div>

				</GovSidebarCard>
			);
		}

		if(votesList.length === 0 && offset > 0) {
			<div className="flex items-center justify-center pt-6 bg-white z-10">
				<div className={`mr-5 flex items-center ${offset === 0 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('prev')}><LeftOutlined className='mr-1' /> Prev</div>
				<div className={`ml-5  flex items-center ${votesList.length < 10 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('next')}>Next <RightOutlined  className='ml-1' /></div>
			</div>;
		}

		return <GovSidebarCard className={className}>
			<div className="flex justify-between mb-6 bg-white z-10">
				<h6 className='dashboard-heading'>Voters</h6>
			</div>
			<PostEmptyState />
		</GovSidebarCard>;
	}

	return <GovSidebarCard className={className}><LoadingState /></GovSidebarCard>;

};

export default React.memo(ReferendumV2VoteInfo);