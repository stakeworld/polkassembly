// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkMotionFragment, OnchainLinkMotionPreimageFragment, OnchainLinkMotionTreasuryFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	className?: string;
	onchainLink: OnchainLinkMotionFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostMotionInfo = ({ className, onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_motion: onchainMotion,
		proposer_address: proposerAddress
	} = onchainLink;

	if (! onchainMotion?.[0]) {
		return null;
	}

	const { memberCount, method, motionProposalArguments, motionProposalHash, preimage, treasurySpendProposal } = onchainMotion[0];

	return (
		<>
			<OnchainInfoWrapper className={className}>
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
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Member count</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{memberCount}
						</div>
					</li>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2 flex items-center'>Motion Hash</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{motionProposalHash}
						</div>
					</li>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Motion&apos;s method</h6>
						<div className={`col-span-4 md:col-span-6 ${method === 'rejectProposal' ? 'bold-red-text' : 'text-navBlue'}`}>
							{method}
						</div>
					</li>
				</ul>
				<div className='mt-5'>
					{motionProposalArguments && motionProposalArguments.length
						? <ArgumentsTableJSONView postArguments={motionProposalArguments} showAccountArguments={false}  />
						: null}
				</div>
				<div className="mt-5 flex flex-col gap-y-5">
					<ProposalInfo preimage={preimage}/>
					<TreasuryInfo treasurySpendProposal={treasurySpendProposal}/>
				</div>
				<ExternalLinks className='mt-5' isMotion={true} onchainId={onchainLink.onchain_motion_id} />
			</OnchainInfoWrapper>
		</>
	);
};

const ProposalInfo = ({ preimage } : {preimage?: OnchainLinkMotionPreimageFragment | null}) => {
	if (!preimage) {
		return null;
	}

	const { metaDescription, method: preimageMethod, preimageArguments } = preimage;

	return (
		<>
			{preimageMethod &&
				<>
					<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5'>
						<h6 className='col-span-6 md:col-span-2'>Method</h6>
						<p className='text-navBlue leading-6 col-span-6'>{preimageMethod}</p>
					</div>
					<div>
						{preimageArguments && preimageArguments.length
							? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true} />
							: null}
					</div>
				</>
			}
			{ metaDescription &&
					<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5'>
						<h6 className='col-span-6 md:col-span-2'>Description</h6>
						<p className='text-navBlue leading-6 col-span-6'>{metaDescription}</p>
					</div>
			}
		</>
	);
};

const TreasuryInfo = ({ treasurySpendProposal }: {treasurySpendProposal?: OnchainLinkMotionTreasuryFragment | null}) => {

	if (!treasurySpendProposal){
		return null;
	}

	const currentNetwork = getNetwork();
	const { beneficiary, bond, value } = treasurySpendProposal;

	return (
		<>
			{beneficiary &&
				<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5'>
					<h6 className='col-span-6 md:col-span-2'>Beneficiary</h6>
					<Address address={beneficiary} />
				</div>}
			{value && currentNetwork &&
					<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5'>
						<h6 className='col-span-6 md:col-span-2'>Value</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</div>}
			{bond && currentNetwork &&
				<>
					<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5'>
						<h6 className='col-span-6 md:col-span-2'>Bond</h6>
						<div className='text-navBlue col-span-4 md:col-span-6'>
							{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</div>
				</>}
		</>
	);
};

export default styled(PostMotionInfo)`
	.bold-red-text {
		color: red_primary;
		font-weight: bold;
	}
`;