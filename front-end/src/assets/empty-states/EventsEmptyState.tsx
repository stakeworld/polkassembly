// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactElement, useState } from 'react';
import Lottie from 'react-lottie-player';

import EventsJson from './lottie-files/events.json';

interface Props {
	width?: number
}

function EventsEmptyState({ width = 100 }: Props): ReactElement {

	const [playing, setPlaying] = useState(true);

	console.log(playing);

	return (
		<Lottie
			animationData={EventsJson}
			style={{
				height: width,
				left: '50%',
				position: 'absolute',
				top: '50%',
				transform: 'translate(-50%, -50%)',
				width: width
			}}
			onLoopComplete={() => setPlaying(false)}
			play={playing}
			goTo={60}
		/>
	);
}

export default EventsEmptyState;
