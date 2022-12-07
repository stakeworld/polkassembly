// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import FellowshipMembersContainer from 'src/components/Listing/FellowshipMembers/FellowshipMembersContainer';

const FellowshipMembers = () => {
	return (
		<>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Fellowship</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
					Fellowship is a mostly self-governing expert body with a primary goal of representing the humans who embody and contain the technical knowledge base of the Polkadot network and protocol.
				</p>
			</div>
			<FellowshipMembersContainer className='mt-8' />
		</>
	);
};

export default FellowshipMembers;