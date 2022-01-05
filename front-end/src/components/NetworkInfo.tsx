// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { chainLinks } from 'src/global/networkConstants';
import InfoBox from 'src/ui-components/InfoBox';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
}

function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const NetworkInfo = ({ className }: Props) => {
	const network = getNetwork();
	const links = chainLinks[network];

	return (
		<InfoBox
			className={className}
			dismissable={false}
			name='networkInfo'
			title={`${capitalize(network)} network`}
		>
			<a
				className='social'
				href={links.homepage}
			>
				<Icon size='large' bordered={true} name='home'/>
			</a>
			<a
				className='social'
				href={links.github}
			>
				<Icon size='large' bordered={true} name='github'/>
			</a>
			<a
				className='social'
				href={links.twitter}
			>
				<Icon size='large' bordered={true} name='twitter'/>
			</a>
			<a
				className='social'
				href={links.discord}
			>
				<Icon size='large' bordered={true} name='discord'/>
			</a>
			<a
				className='social'
				href={links.youtube}
			>
				<Icon size='large' bordered={true} name='youtube'/>
			</a>
			<a
				className='social'
				href={links.reddit}
			>
				<Icon size='large' bordered={true} name='reddit'/>
			</a>
			<a
				className='social'
				href={links.telegram}
			>
				<Icon size='large' bordered={true} name='telegram'/>
			</a>
			<a
				className='social'
				href={links.blockExplorer}
			>
				<Icon size='large' bordered={true} name='cube'/>
			</a>
		</InfoBox>
	);
};

export default styled(NetworkInfo)`
	a {
		color: black_primary;
		text-decoration: none;
		&:hover {
			color: grey_primary;
			text-decoration: none;
		}
	}
`;
