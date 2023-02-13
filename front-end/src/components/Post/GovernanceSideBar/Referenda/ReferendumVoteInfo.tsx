// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import BN from 'bn.js';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { subscanApiHeaders } from 'src/global/apiHeaders';
import { getFailingThreshold } from 'src/polkassemblyutils';
import { LoadingStatusType } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import PassingInfoTag from 'src/ui-components/PassingInfoTag';
import VoteProgress from 'src/ui-components/VoteProgress';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

import VotersList from './VotersList';

interface Props {
	className?: string
	referendumId: number
	totalIssuance: BN | null
}

type VoteInfo = {
	aye_amount: BN;
	aye_without_conviction: BN;
	isPassing: boolean | null;
	nay_amount: BN;
	nay_without_conviction: BN;
	turnout: BN;
	voteThreshold: string;
}

const ZERO = new BN(0);
const NETWORK = getNetwork();

const ReferendumVoteInfo = ({ className, referendumId, totalIssuance }: Props) => {
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const [voteInfo, setVoteInfo] = useState<VoteInfo | null>(null);
	const [turnoutPercentage, setTurnoutPercentage] = useState<number | null>(null);

	const fetchReferendumVoteInfo = useCallback((totalIssuance: BN) => {
		if(voteInfo) return;

		setLoadingStatus({
			isLoading: true,
			message: 'Loading Data'
		});

		fetch(`https://${NETWORK}.api.subscan.io/api/scan/democracy/referendum`, {
			body: JSON.stringify({
				referendum_index: referendumId
			}),
			headers: subscanApiHeaders,
			method: 'POST'
		})
			.then((res) => res.json())
			.then(voteInfoData => {

				if(voteInfoData && voteInfoData.data && voteInfoData.data.info) {
					const info = voteInfoData.data.info;

					const voteInfo: VoteInfo = {
						aye_amount : ZERO,
						aye_without_conviction: ZERO,
						isPassing: null,
						nay_amount: ZERO,
						nay_without_conviction: ZERO,
						turnout: ZERO,
						voteThreshold: ''
					};

					voteInfo.aye_amount = new BN(info.aye_amount);
					voteInfo.aye_without_conviction = new BN(info.aye_without_conviction);
					voteInfo.nay_amount = new BN(info.nay_amount);
					voteInfo.nay_without_conviction = new BN(info.nay_without_conviction);
					voteInfo.turnout = new BN(info.turnout);
					voteInfo.voteThreshold = info.vote_threshold.split(/(?=[A-Z])/).join(' ');

					if(totalIssuance !== null) {
						let capitalizedVoteThreshold = info.vote_threshold.toLowerCase();
						capitalizedVoteThreshold = `${capitalizedVoteThreshold.charAt(0).toUpperCase()}${capitalizedVoteThreshold.slice(1)}`;
						//nays needed for a referendum to fail
						const { failingThreshold } = getFailingThreshold({
							ayes: voteInfo.aye_amount,
							ayesWithoutConviction: voteInfo.aye_without_conviction,
							threshold: capitalizedVoteThreshold,
							totalIssuance: totalIssuance
						});

						if(failingThreshold){
							try {
								if(voteInfo.nay_amount.gte(failingThreshold)) {
									voteInfo.isPassing = false;
								} else {
									voteInfo.isPassing = true;
								}
							} catch(e) {
								console.log('Error calculating Passing state: ', e);
							}
						}
					}

					setVoteInfo(voteInfo);
				}

			}).finally(() => {
				setLoadingStatus({
					isLoading: false,
					message: 'Loading Data'
				});
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const calculateTurnoutPercentage = useCallback((totalIssuance: BN) => {
		if (!voteInfo || !totalIssuance) {
			return 0;
		}
		// BN doens't handle floats. If we devide a number by a bigger number (12/100 --> 0.12), the result will be 0
		// therefore, we first multiply by 10 000, which gives (120 000/100 = 1200) go to Number which supports floats
		// and devide by 100 to have percentage --> 12.00%
		setTurnoutPercentage(voteInfo?.turnout.muln(10000).div(totalIssuance).toNumber()/100);
	} , [voteInfo]);

	useEffect(() => {
		if (totalIssuance) {
			fetchReferendumVoteInfo(totalIssuance);
			calculateTurnoutPercentage(totalIssuance);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalIssuance]);

	return (
		<>
			{!voteInfo ?
				<GovSidebarCard className='flex items-center justify-center min-h-[100px]'>
					<Loader />
				</GovSidebarCard>
				:
				<GovSidebarCard className={className}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-7">
							<h6 className='dashboard-heading text-base whitespace-pre mr-3'>Voting Status</h6>
							<div className='flex items-center gap-x-2 justify-end'>
								<div className={'text-sidebarBlue border-navBlue border xl:max-w-[120px] 2xl:max-w-[100%] text-xs rounded-full px-3 py-1 whitespace-nowrap truncate h-min'}>
									{ voteInfo?.voteThreshold }
								</div>
								{voteInfo.isPassing !== null && <PassingInfoTag isPassing={voteInfo?.isPassing}/>}
							</div>
						</div>

						<div className="flex justify-between">
							<VoteProgress
								ayeVotes={voteInfo?.aye_amount}
								className='vote-progress'
								nayVotes={voteInfo?.nay_amount}
							/>

							<div className='flex-1 flex flex-col justify-between ml-4 md:ml-6 2xl:ml-12 py-9'>
								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium'>Turnout {turnoutPercentage && turnoutPercentage > 0 && <span className='turnoutPercentage'>({turnoutPercentage}%)</span>}</div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.turnout, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Aye <HelperTooltip className='ml-2' text='Aye votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.aye_amount, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nay <HelperTooltip className='ml-2' text='Nay votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.nay_amount, { numberAfterComma: 2, withUnit: true })}</div>
								</div>
							</div>
						</div>
					</Spin>
				</GovSidebarCard>
			}

			<VotersList className={className} referendumId={referendumId} />
		</>
	);
};

export default memo(ReferendumVoteInfo);
