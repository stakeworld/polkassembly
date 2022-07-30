// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { Dimmer, Loader as SUILoader } from 'semantic-ui-react';

interface Props{
	className?: string
	text?: string
	timeout?: number
	timeoutText?: string
	delayTextTimeout?: number
	delayText?: string
	size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive',
}
const Loader = ({ className, text = 'Loading', timeout, timeoutText = 'Process timeout', delayText='Please wait', delayTextTimeout=35000, size }: Props) => {
	const [displayLoader, setDisplayLoader] = useState(true);
	const [showDelayText, setShowDelayText] = useState(false);

	useEffect(() => {
		if (timeout) {
			const timer = setTimeout(() => {
				setDisplayLoader(false);
			}, timeout);

			const delayTextTimer = setTimeout(() => {
				setShowDelayText(true);
			}, delayTextTimeout);

			return () => {
				clearTimeout(timer);
				clearTimeout(delayTextTimer);
			};
		}
	}, [timeout, delayTextTimeout]);

	return (
		<>
			{displayLoader
				?
				<Dimmer inverted active className={className}>
					<SUILoader inverted className={size ? size : ''}>{showDelayText ? delayText : text}</SUILoader>
				</Dimmer>
				:
				<div className={`${className} error-text`}>{timeoutText}</div>
			}
		</>
	);
};

export default styled(Loader)`
    background-color: inherit!important;

	&.ui.inverted.dimmer {
		border-radius: 3px;
	}

	.error-text {
		color: red_secondary;
	}
`;
