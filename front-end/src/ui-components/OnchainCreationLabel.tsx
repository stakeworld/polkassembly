// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Address from '../ui-components/Address';
import TopicTag from '../ui-components/TopicTag';

interface Props {
	address: string
	className?: string
	topic: string
}

const OnchainCreationLabel = ({ address, className, topic }:Props ) => {
	return (
		<div className={`${className} text-navBlue flex items-center text-[12px]`}>
			by
			<Address
				address={address}
				className='address ml-2'
				displayInline={true}
			/>
				from <TopicTag className='ml-[0.6rem]' topic={topic} />
		</div>
	);
};

export default OnchainCreationLabel;
