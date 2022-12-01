// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import TreasuryProposalFormButton from 'src/components/CreateTreasuryProposal/TreasuryProposalFormButton';
import TreasuryOverview from 'src/components/Home/TreasuryOverview';
import TreasuryContainer from 'src/components/Listing/Treasury/TreasuryContainer';

const Treasury = () => {
	return (
		<>
			<div className='w-full flex flex-col sm:flex-row sm:items-center'>
				<h1 className='dashboard-heading flex-1 mb-4 sm:mb-0'>On Chain Treasury Proposals</h1>
				<TreasuryProposalFormButton  />
			</div>

			{/* Intro and Create Post Button */}
			<div className="mt-8">
				<p className="text-sidebarBlue h-full text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
					This is the place to discuss on-chain treasury proposals. On-chain posts are automatically generated as soon as they are created on the chain.
					Only the proposer is able to edit them.
				</p>
			</div>
			{/* Treasury Overview Cards */}
			<TreasuryOverview inTreasuryProposals={true} className='mt-8'/>

			<TreasuryContainer className='mt-8' />
		</>
	);
};

export default Treasury;