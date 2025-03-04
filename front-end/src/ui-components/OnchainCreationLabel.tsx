// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Address from '../ui-components/Address';
import TopicTag from '../ui-components/TopicTag';

interface Props {
	address: string
	topic: string
}

const OnchainCreationLabel = ({ address, topic }:Props ) => {
	return (
		<div className='flex justify-between min-[340px]:flex-row min-[340px]:items-center text-xs text-navBlue w-full min-[340px]:w-auto'>
			<div className='flex items-center'>
				<div>By:</div>
				<Address
					address={address}
					className='address ml-1.5'
					displayInline={true}
				/>
			</div>
			<div className='flex items-center'>
				<div className='mr-1.5 ml-auto hidden min-[340px]:flex'>from</div>
				<TopicTag topic={topic} />
			</div>
		</div>
	);
};

export default OnchainCreationLabel;
