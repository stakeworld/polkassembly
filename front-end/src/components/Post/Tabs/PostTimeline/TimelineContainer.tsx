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
	last?: boolean;
}

function sortfunc(a: BlockStatus, b: BlockStatus) {
	return a.blockNumber - b.blockNumber;
}

const TimelineContainer: React.FC<ITimelineContainerProps> = (props) => {
	const { statuses, title, last } = props;
	const { blocktime } = useBlockTime();
	const ZERO = new BN(0);
	const currentBlock = useCurrentBlock() || ZERO;
	if (statuses.length === 0) return null;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const StatusDiv = ({ status } : { status: string }) => {
		return (
			<div className='flex items-center absolute -top-3.5 justify-center'>
				<StatusTag colorInverted={true} status={status}/>
			</div>
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const TimelineItems = (isMobile:boolean) => {
		return (
			<section className={`flex-1 flex ${isMobile? 'flex-col items-start gap-y-20 py-20': 'items-center'}`}>
				{
					statuses.sort(sortfunc).map(({ blockNumber, status }, index) => {
						const date = blockToTime(currentBlock.toNumber() - blockNumber, blocktime);
						const dateSplit = date.split(' ');
						const days = Number(dateSplit[0].replace('d', ''));
						const hours = Number(dateSplit[1].replace('h', ''));
						const minutes = Number(dateSplit[2].replace('m', ''));
						const blockDate = moment().subtract({
							day: days,
							hour: hours,
							minute: minutes
						}).format('Do MMMM, YYYY');
						return (
							<div key={status} className='flex items-center flex-1 w-full'>
								{
									index === 0 || isMobile?
										<div className='grow-[1.5] min-w-[20px] max-w-[100px] h-[1px] bg-[#F796C9]'></div>
										: null
								}
								<article className={`flex flex-col items-center gap-y-2 font-normal text-sidebarBlue px-[14px] pb-4 pt-8 rounded-lg border border-[#F796C9] relative ${(index === statuses.length - 1 && last)? 'border-dashed': ''}`}>
									<StatusDiv status={status} />
									<p className='flex items-center gap-x-1'>
										Block:
										<a className='text-pink_primary font-medium' href={`https://${NETWORK}.subscan.io/block/${blockNumber}`} target='_blank' rel="noreferrer">
											#{`${blockNumber} `}
										</a>
									</p>
									{
										currentBlock.toNumber() ?
											(
												<p className='flex items-center'>{blockDate}</p>
											)
											: null
									}
								</article>
								{
									(index !== statuses.length - 1) && !isMobile ?
										<div className='grow-[1] min-w-[10px] max-w-[75px] h-[1px] bg-[#F796C9]'></div>
										: null
								}
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
				<span className='bg-pink_primary rounded-2xl font-medium text-base text-white min-w-[100px] px-5 h-[33px] flex items-center justify-center absolute -left-5 -top-5'>
					{title}
				</span>
				<span className='bg-pink_primary rounded-full absolute -bottom-1 -left-1 w-[10px] h-[10px]'>
				</span>
			</div>
			<div className="hidden md:flex flex-1">
				{TimelineItems(false)}
			</div>
			<div className="flex md:hidden flex-1">
				{TimelineItems(true)}
			</div>
		</section>
	);
};

export default TimelineContainer;
