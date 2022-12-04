// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { OnchainLinkChildBountyFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	onchainLink: OnchainLinkChildBountyFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostChildBountyInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_child_bounty: onchainChildBountyProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const {
		value,
		fee,
		curatorDeposit,
		curator,
		beneficiary,
		description
	} = onchainChildBountyProposal?.[0] || { };

	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
					View Other Proposals
				</div>
				<h5 className='mb-5 font-bold text-base'>Metadata</h5>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Proposer</h6>
						<article className='flex gap-x-2 col-span-4 md:col-span-6 overflow-hidden'>
							<Address  displayInline={true} address={proposerAddress}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{curator && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Curator</h6>
						<div className='col-span-4 md:col-span-6 overflow-hidden'>
							<Address  displayInline={true} address={curator}/>
						</div>
					</li>}
					{beneficiary && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Beneficiary</h6>
						<div className='col-span-4 md:col-span-6 overflow-hidden'>
							<Address  displayInline={true} address={beneficiary}/>
						</div>
					</li>}
					{value && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Value</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</li>}
					{fee && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Fee</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(fee) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</li>}
					{curatorDeposit && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Curator Deposit</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(curatorDeposit) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</li>}
				</ul>
				{description && description.length > 2 &&
				<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5 mt-5'>
					<h6 className='col-span-6 md:col-span-2'>Description</h6>
					<p className='text-navBlue leading-6 col-span-6'>{description}</p>
				</div>}
			</OnchainInfoWrapper>
		</>
	);
};

export default PostChildBountyInfo;
