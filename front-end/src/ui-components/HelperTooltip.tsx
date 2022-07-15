// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Popup } from 'semantic-ui-react';

import infoCircleIcon from '../assets/InfoCircle.png';

const popupStyle = {
	fontSize: '1.2rem',
	marginLeft: '-1rem'
};

const myIcon = ({ className }:{className?: string}) => <img className={className} src={infoCircleIcon} />;

export const StyledIcon = styled(myIcon)`
	margin-top: -0.25em !important;
	margin-left: 0.25em !important;
	height: 18px;
	width: 18px;

	&.small {
		height: 14px;
		width: 14px;
		margin-top: 1.6px !important;
		margin-left: 3.5px !important;
	}
`;

interface Props {
	content: string
	position?: 'top left' | 'top right' | 'bottom right' | 'bottom left' | 'right center' | 'left center' | 'top center' | 'bottom center' | undefined
	basic?: boolean,
	iconSize?: 'small' | 'normal'
}

const HelperTooltip = ({ content, position, basic = false, iconSize }:Props) =>
	<Popup
		trigger={<span><StyledIcon className={ iconSize } /></span>}
		content={content}
		style={popupStyle}
		hoverable={true}
		position={position}
		basic={basic}
		hideOnScroll
	/>;

export default HelperTooltip;
