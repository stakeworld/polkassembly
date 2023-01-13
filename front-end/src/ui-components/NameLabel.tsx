// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Address from './Address';

interface Props {
	className?: string
	defaultAddress?: string | null
	username?: string
	disableIdenticon?: boolean
	textClassName?: string
}

const NameLabel = ({ className, defaultAddress, username, disableIdenticon = false, textClassName } : Props) => {
	return (
		<div className={`${className} mr-2`}>
			{!defaultAddress ? <span className='username text-navBlue font-medium mr-1.5'> { username } </span> :
				<Address
					address={defaultAddress}
					className='text-sm'
					textClassName={textClassName}
					displayInline={true}
					disableIdenticon={disableIdenticon}
				/>}
		</div>
	);
};

export default NameLabel;