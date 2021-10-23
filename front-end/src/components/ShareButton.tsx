// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon } from 'semantic-ui-react';

import Button from '../ui-components/Button';
import getNetwork from '../util/getNetwork';

const NETWORK = getNetwork();

const ShareButton = function ({ title }: {title?: string | null}) {

	const share = () => {
		const twitterParameters = [];

		twitterParameters.push(`url=${encodeURI(global.window.location.href)}`);

		if (title) {
			twitterParameters.push(`text=${encodeURI(`[${NETWORK}] ${title}`)}`);
		}

		twitterParameters.push('via=' + encodeURI('polkassembly'));

		const url = 'https://twitter.com/intent/tweet?' + twitterParameters.join('&');

		global.window.open(url);
	};

	return (
		<>
			<Button
				className={'social'}
				onClick={share}
			>
				<Icon name='twitter'/>{' Share'}
			</Button>
		</>
	);
};

export default ShareButton;
