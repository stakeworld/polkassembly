// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import TechCommProposalsContainer from 'src/components/Listing/TechCommProposals/TechCommProposalsContainer';

const TechCommProposals = () => {
	return (
		<>
			<h1 className='dashboard-heading mb-4 md:mb-6'>On Chain Technical Committee Proposals</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
					This is the place to discuss on-chain technical committee proposals. On-chain posts are automatically generated as soon as they are created on the chain.
					Only the proposer is able to edit them.
				</p>
			</div>
			<TechCommProposalsContainer className='mt-8' />
		</>
	);
};

export default TechCommProposals;