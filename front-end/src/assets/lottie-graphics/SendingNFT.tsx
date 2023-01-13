// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactElement } from 'react';
import Lottie from 'react-lottie-player';

import SendingNFTJson from './lottie-files/gift-outline.json';

interface Props {
	message?: string
	width?: number
}

function SendingNFT({ message, width = 250 }: Props): ReactElement {

	return (
		<div>
			<Lottie
				animationData={SendingNFTJson}
				style={{
					height: width,
					width: width
				}}
				play={true}
			/>
			<div className='text-sidebarBlue font-medium w-full text-center' >{message}</div>
		</div>
	);
}

export default SendingNFT;
