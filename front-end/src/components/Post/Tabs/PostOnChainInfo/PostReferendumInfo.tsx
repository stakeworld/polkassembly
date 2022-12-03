// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as moment from 'moment';
import * as React from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import BlocksToTime from 'src/components/BlocksToTime';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkReferendumFragment } from 'src/generated/graphql';
import Address from 'src/ui-components/Address';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkReferendumFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostReferendumInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_referendum: onchainReferendum,
		proposer_address: proposerAddress
	} = onchainLink;

	if ( !onchainReferendum?.[0] ){
		return null;
	}

	const { delay, end, referendumStatus, preimage, voteThreshold } = onchainReferendum[0];
	const { metaDescription, method, preimageArguments } = preimage || {};
	const { blockNumber, status } = referendumStatus?.[0] || {};
	console.log(onchainReferendum[0]);
	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
					View Other Proposals
				</div>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Proposer</h6>
						<article className='flex gap-x-2 col-span-4 md:col-span-6'>
							<Address address={proposerAddress}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{method && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Method</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>{method}</div>
					</li>}
					{end && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						{status === 'Started'
							?
							<>
								<h6 className='col-span-2'>End</h6>
								<div className='col-span-4 md:col-span-6'>
									<BlockCountdown className='text-navBlue' endBlock={end}/>
								</div>
							</>
							:
							<>
								<h6 className='col-span-2'>Ended</h6>
								<div className='text-navBlue col-span-4 md:col-span-6'>{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}</div>
							</>
						}
					</li>}
					{(delay || delay === 0) &&
						<li className="grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5">
							<h6 className='col-span-2'>Delay</h6>
							<div className='text-navBlue col-span-4 md:col-span-6'><BlocksToTime blocks={delay} /></div>
						</li>
					}
					{voteThreshold &&
						<li className="grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5">
							<h6 className='col-span-2'>Vote threshold</h6>
							<div className='text-navBlue col-span-4 md:col-span-6'>{voteThreshold}</div>
						</li>
					}
				</ul>
				{method &&
				<>
					<div className='arguments max-w-full mt-5'>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
							: null}
					</div>
				</>}
				{metaDescription &&
				<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5 mt-2'>
					<h6 className='col-span-2'>Description</h6>
					<p className='text-navBlue leading-6 col-span-4 md:col-span-6'>{metaDescription}</p>
				</div>}
				<ExternalLinks className='mt-5' isReferendum={true} onchainId={onchainLink.onchain_referendum_id} />
			</OnchainInfoWrapper>
		</>
	);
};

export default PostReferendumInfo;