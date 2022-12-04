// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkProposalFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkProposalFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostProposalInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_proposal: onchainProposal,
		proposer_address: proposerAddress
	} = onchainLink;
	const preimage = onchainProposal?.[0]?.preimage;
	const depositAmount = onchainProposal?.[0]?.depositAmount;

	const { metaDescription, method, preimageArguments } = preimage || {};

	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
					View Other Proposals
				</div>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className="grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5">
						<h6 className='col-span-2'>Proposer</h6>
						<article className="flex gap-x-2 col-span-4 md:col-span-6 overflow-hidden">
							<Address displayInline={true} address={proposerAddress}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{depositAmount && currentNetwork && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Deposit</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>{parseInt(depositAmount) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</li>}
					{method && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Method</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>{method}</div>
					</li>}
				</ul>
				{method &&
				<div className='mt-5'>
					<div className='arguments'>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
							: null}
					</div>
				</div>}
				{metaDescription &&
				<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5 mt-5'>
					<h6 className='col-span-6 md:col-span-2'>Description</h6>
					<p className='text-navBlue leading-6 col-span-6'>{metaDescription}</p>
				</div>}
				<ExternalLinks className='mt-5' isProposal={true} onchainId={onchainLink.onchain_proposal_id} />
			</OnchainInfoWrapper>
		</>
	);
};

export default PostProposalInfo;