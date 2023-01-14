// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactElement, useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

import SendingNFTJson from './lottie-files/gift-outline.json';

interface Props {
	message?: string
	width?: number
	waitMessage?: string
}

function SendingNFT({ message, waitMessage='Please Wait...', width = 250 }: Props): ReactElement {

	const [wait, setWaitMessage] = useState<string>('');

	useEffect(() => {
		setTimeout(() => setWaitMessage(waitMessage), 10000);
	}, [waitMessage]);

	return (
		<div className='w-full flex flex-col justify-center items-center'>
			<Lottie
				animationData={SendingNFTJson}
				style={{
					height: width,
					width: width
				}}
				play={true}
			/>
			<div className='text-sidebarBlue font-medium' >{message}</div>
			<div className='text-sidebarBlue font-medium' >{wait}</div>
		</div>
	);
}

export default SendingNFT;
