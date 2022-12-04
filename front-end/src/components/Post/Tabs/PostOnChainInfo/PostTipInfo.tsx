// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as moment from 'moment';
import React from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import { OnchainLinkTipFragment } from 'src/generated/graphql';
import { tipStatus as tipStatuses } from 'src/global/statuses';
import Address from 'src/ui-components/Address';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkTipFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostTipInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_tip: onchainTipProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const { closes, finder, hash, reason, who, tipStatus  } = onchainTipProposal?.[0] || { };
	const { blockNumber, status } = tipStatus?.[0] || {};

	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
					View Other Proposals
				</div>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2 flex items-center'>Proposer</h6>
						<article className='flex gap-x-2 col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={proposerAddress}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{hash && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2 flex items-center'>Hash</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{hash}
						</div>
					</li>}
					{reason && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2 flex items-center'>Reason</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{reason}
						</div>
					</li>}
					{who && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b pb-1.5'>
						<h6 className='col-span-2 pt-1.5'>Receiver</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={who}/>
						</div>
					</li>}
					{finder && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b pb-1.5'>
						<h6 className='col-span-2 pt-1.5'>Finder</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={finder}/>
						</div>
					</li>}
					{closes && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b pb-1.5'>
						{status === tipStatuses.CLOSING
							?
							<>
								<h6 className='col-span-2 pt-1.5'>Closing</h6>
								<div className='col-span-4 md:col-span-6 overflow-hidden'>
									<BlockCountdown endBlock={closes}/>
								</div>
							</>
							:  status === tipStatuses.CLOSED
								?
								<>
									<h6 className='col-span-2 pt-1.5'>Closed</h6>
									<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
										{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}
									</div>
								</>
								: <span className='col-span-6 md:col-span-8'>#{closes}</span>
						}
					</li>}
				</ul>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostTipInfo;
