// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { OnchainLinkBountyFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	onchainLink: OnchainLinkBountyFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostBountyInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_bounty: onchainBountyProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const {
		value,
		fee,
		curatorDeposit,
		bond,
		curator,
		beneficiary
	} = onchainBountyProposal?.[0] || { };

	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
					View Other Proposals
				</div>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Proposer</h6>
						<article className='flex gap-x-2 col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={proposerAddress}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{curator && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b pb-1.5'>
						<h6 className='col-span-2 pt-1.5'>Curator</h6>
						<div className='col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={curator}/>
						</div>
					</li>}
					{beneficiary && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b pb-1.5'>
						<h6 className='col-span-2 pt-1.5'>Beneficiary</h6>
						<div className='col-span-4 md:col-span-6 overflow-hidden'>
							<Address address={beneficiary}/>
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
					{bond && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Bond</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</li>}
				</ul>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostBountyInfo;
