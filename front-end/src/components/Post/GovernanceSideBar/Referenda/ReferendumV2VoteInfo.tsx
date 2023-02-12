// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LeftOutlined, LikeFilled, MinusCircleFilled, RightOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
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
	isFellowshipReferendum?: boolean
}

type DecisionType = 'yes' | 'no' | 'abstain';

const ReferendumV2VoteInfo = ({ className, referendumId, isFellowshipReferendum } : Props) => {
	const [offset, setOffset] = useState<number>(0);
	const [votesList, setVotesList] = useState<any[] | null>(null);
	const [error, setError] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [fetchDecision, setFetchDecision] = useState<DecisionType>('yes');

	const fetchVotesData = useCallback(() => {
		setLoading(true);
		fetch('https://squid.subsquid.io/kusama-polkassembly/v/v2/graphql',
			{ body: JSON.stringify({
				query: `query MyQuery {
					${isFellowshipReferendum ? 'votes' : 'convictionVotes'}(where: {type_eq: ${isFellowshipReferendum ? 'Fellowship' : 'ReferendumV2'}, ${!isFellowshipReferendum ? 'removedAtBlock_isNull: true,' : ''} proposal: {index_eq: ${referendumId}}, decision_eq: ${fetchDecision}}, limit: ${10}, offset: ${offset}, orderBy: id_DESC) {
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
						${!isFellowshipReferendum ? 'createdAtBlock' : ''}
						decision
						id
						lockPeriod
						proposalId
						${!isFellowshipReferendum ? 'createdAt' : ''}
						voter
						${!isFellowshipReferendum ? 'isDelegated' : ''}
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
				if(response && response.data && (response.data.convictionVotes || response.data.votes)) {
					const votesData = response.data.convictionVotes || response.data.votes;
					setVotesList(votesData);
				}
			}).catch((err) => {
				setError(err);
				console.log('Error in fetching voters :', err);
			}).finally(() => {
				setLoading(false);
			});
	}, [isFellowshipReferendum, fetchDecision, offset, referendumId]);

	useEffect(() => {
		fetchVotesData();
	}, [fetchVotesData, offset, referendumId]);

	const decisionOptions = [
		{
			label: <div className='flex items-center justify-center'><LikeFilled className='mr-1.5' /> <span>Ayes</span></div>,
			value: 'yes'
		},
		{
			label: <div className='flex items-center justify-center'><DislikeFilled className='mr-1.5' /> <span>Nays</span></div>,
			value: 'no'
		}
	];

	if(!isFellowshipReferendum) {
		decisionOptions.push({
			label: <div className='flex items-center justify-center'><MinusCircleFilled className='mr-1.5' /> <span>Abstain</span></div>,
			value: 'abstain'
		});
	}

	function handlePagination(navDirection: 'next' | 'prev'){
		if(loading) return;

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
		return (
			<GovSidebarCard className={className}>
				<div className="flex justify-between mb-6 bg-white z-10">
					<h6 className='dashboard-heading'>Voters</h6>
				</div>

				<div className="w-full flex items-center justify-center mb-8">
					<Segmented
						block
						className='px-3 py-2 rounded-md w-full'
						size="large"
						defaultValue={fetchDecision}
						onChange={(value) => {
							setOffset(0);
							setFetchDecision(String(value) as DecisionType);
						}}
						options={decisionOptions}
					/>
				</div>

				{loading ? <LoadingState />
					: votesList.length > 0 ?
						<div className={`flex flex-col text-xs xl:text-sm xl:max-h-screen gap-y-1 overflow-y-auto px-${isFellowshipReferendum ? '8' : '0'} text-sidebarBlue`}>
							<div className='flex text-xs items-center justify-between mb-9 font-semibold'>
								<div className='w-[110px]'>Voter</div>
								{!isFellowshipReferendum && <div className='w-[60px]'><span className='hidden md:inline-block'>Amount</span><span className='inline-block md:hidden'>Amt.</span></div>}
								{!isFellowshipReferendum && <div className='w-[70px]'>Conviction</div>}
								<div className='w-[30px]'>Vote</div>
							</div>

							{votesList.map((voteData: any, index:number) =>
								<div className='flex items-center justify-between mb-9' key={index}>
									<div className='w-[110px] max-w-[110px] overflow-ellipsis'>
										<Address textClassName='w-[90px] text-xs' displayInline={true} address={voteData.voter} />
									</div>

									{!isFellowshipReferendum && voteData.balance.value !== undefined ? <div className='w-[80px] max-w-[80px] overflow-ellipsis'>{formatBnBalance(voteData.balance.value, { numberAfterComma: 2, withUnit: true })}</div> : <div>-</div>}

									<div className='w-[50px] max-w-[50px] overflow-ellipsis'>
										{voteData.lockPeriod ? <span>{voteData.lockPeriod}x {voteData?.isDelegated && '/d'}</span> : <span>-</span>}
									</div>

									{voteData.decision === 'yes' ?
										<div className='flex items-center text-aye_green text-md w-[20px] max-w-[20px]'>
											<LikeFilled className='mr-2' />
										</div>
										: voteData.decision === 'no' ?
											<div className='flex items-center text-nay_red text-md w-[20px] max-w-[20px]'>
												<DislikeFilled className='mr-2' />
											</div>
											: <div className='flex items-center text-gray-500 text-md w-[20px] max-w-[20px]'>
												<MinusCircleFilled className='mr-2' />
											</div>
									}
								</div>
							)}

						</div>
						: <PostEmptyState />
				}

				<div className="flex items-center justify-center pt-6 bg-white z-10">
					<div className={`mr-5 flex items-center ${offset === 0 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('prev')}><LeftOutlined className='mr-1' /> Prev</div>
					<div className={`ml-5  flex items-center ${votesList.length < 10 ? ' cursor-default' : 'cursor-pointer hover:text-pink_primary'}`} onClick={() => handlePagination('next')}>Next <RightOutlined  className='ml-1' /></div>
				</div>

			</GovSidebarCard>
		);
	}

	return <GovSidebarCard className={className}><LoadingState /></GovSidebarCard>;

};

export default React.memo(ReferendumV2VoteInfo);