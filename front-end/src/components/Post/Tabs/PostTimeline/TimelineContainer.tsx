// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import moment from 'moment';
import * as React from 'react';
import { useBlockTime, useCurrentBlock } from 'src/hooks';
import StatusTag from 'src/ui-components/StatusTag';
import blockToTime from 'src/util/blockToTime';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

interface BlockStatus {
	blockNumber: number
	status: string
}

interface ITimelineContainerProps {
	className?: string;
	statuses: BlockStatus[];
	title?: string;
}

function sortfunc(a: BlockStatus, b: BlockStatus) {
	return a.blockNumber - b.blockNumber;
}

function getBlockDate(currentBlockToNumber: number, blockNumber: number, blockTime?: number) {
	const date = blockToTime(currentBlockToNumber - blockNumber, blockTime);
	const dateSplit = date.split(' ');
	const days = Number(dateSplit[0].replace('d', ''));
	const hours = Number(dateSplit[1].replace('h', ''));
	const minutes = Number(dateSplit[2].replace('m', ''));
	return moment().subtract({
		day: days,
		hour: hours,
		minute: minutes
	});
}

const TimelineContainer: React.FC<ITimelineContainerProps> = (props) => {
	const { statuses, title } = props;
	const { blocktime } = useBlockTime();
	const ZERO = new BN(0);
	const currentBlock = useCurrentBlock() || ZERO;
	if (statuses.length === 0) return null;

	const StatusDiv = ({ status } : { status: string }) => {
		return (
			<div className='flex items-center absolute -top-3.5 justify-center'>
				<StatusTag colorInverted={true} status={status}/>
			</div>
		);
	};

	const TimelineItems = (isMobile:boolean) => {
		return (
			<section className={`flex-1 flex ${isMobile? 'flex-col items-start gap-y-20 py-20': 'items-center'}`}>
				{
					statuses.sort(sortfunc).map(({ blockNumber, status }, index) => {
						const currentBlockToNumber = currentBlock.toNumber();
						const blockDate = getBlockDate(currentBlockToNumber, blockNumber, blocktime).format('Do MMMM, YYYY');
						return (
							<div key={status} className={`flex flex-1 items-center ${index === 0? 'max-w-[258px] ': 'max-w-[211px] '}`}>
								<div className='flex-1 min-w-[20px] h-[1px] bg-navBlue'></div>
								<article className='flex flex-col items-center gap-y-2 font-normal text-sidebarBlue px-[14px] pb-4 pt-8 rounded-lg border border-navBlue relative bg-comment_bg'>
									<StatusDiv status={status} />
									<p className='flex items-center gap-x-1'>
										Block:
										<a className='text-pink_primary font-medium' href={`https://${NETWORK}.subscan.io/block/${blockNumber}`} target='_blank' rel="noreferrer">
											#{`${blockNumber} `}
										</a>
									</p>
									{
										currentBlockToNumber ?
											(
												<p className='flex items-center'>{blockDate}</p>
											)
											: null
									}
								</article>
							</div>
						);
					})
				}
			</section>
		);
	};

	return (
		<section className='flex'>
			<div className='min-h-[300px] bg-pink_primary w-[2px] relative'>
				<span className='bg-pink_primary rounded-2xl font-medium text-base text-white whitespace-nowrap min-w-[100px] px-5 h-[33px] flex items-center justify-center absolute -left-5 -top-5'>
					{title}
				</span>
				<span className='bg-pink_primary rounded-full absolute -bottom-1 -left-1 w-[10px] h-[10px]'>
				</span>
			</div>
			<div className="hidden md:flex flex-1 overflow-hidden">
				{TimelineItems(false)}
			</div>
			<div className="flex md:hidden flex-1 overflow-hidden">
				{TimelineItems(true)}
			</div>
		</section>
	);
};

export default TimelineContainer;
