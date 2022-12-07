// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SyncOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { gov2Routes } from './SwitchRoutes';

interface Props {
	className?: string;
}

const GovernanceSwitchButton = ({ className } : Props) => {
	const { pathname } = useLocation();
	const isGov2Route: boolean = gov2Routes.includes(pathname.split('/')[1]);

	return (
		<div className={`${className} v2-button-wrapper`}>
			<Link className='v2-box font-semibold rounded-md text-sidebarBlue hover:text-pink_primary flex items-center' to={isGov2Route ? '/' : '/gov-2'}>
				<p className='mr-2'><SyncOutlined /></p>
				<p> {isGov2Route ? 'Governance V1' : 'Governance V2'} </p>
			</Link>
		</div>
	);
};

export default GovernanceSwitchButton;