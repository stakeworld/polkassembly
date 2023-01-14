// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactElement } from 'react';
import Lottie from 'react-lottie-player';

import WrongQuizAnswerJson from './lottie-files/confetti-outline.json';

interface Props {
	width?: number
    message?: string
}

function VoteSuccessful( { message, width = 250 }: Props): ReactElement {

	return (
		<div className='w-full flex flex-col justify-center items-center'>
			<Lottie
				animationData={WrongQuizAnswerJson}
				style={{
					height: width,
					width: width
				}}
				play={true}
			/>
			<div className='text-sidebarBlue mb-2 text-lg font-bold' >Success</div>
			<div className='text-sidebarBlue font-medium'>{message}</div>
		</div>
	);
}

export default VoteSuccessful;
