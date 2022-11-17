// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SwapOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const gov2Routes = [
	'gov-2',
	'track'
];

interface Props {
	className?: string;
}

const GovernanceSwitchButton = ({ className } : Props) => {
	const { pathname } = useLocation();
	const cleanPathName = pathname.split('/')[1];

	return (
		<Link className={`${className} flex items-center font-semibold text-sidebarBlue hover:text-pink_primary`} to={gov2Routes.includes(cleanPathName) ? '/' : '/gov-2'}>
			<div className='-mt-1 mr-2'><SwapOutlined /></div>
			<div> Switch to {gov2Routes.includes(cleanPathName) ? 'Governance V1' : 'Governance V2'} </div>
		</Link>
	);
};

export default GovernanceSwitchButton;