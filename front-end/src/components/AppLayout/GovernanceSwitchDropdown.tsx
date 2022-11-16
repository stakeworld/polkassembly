// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const gov2Routes = [
	'gov-2',
	'track'
];

interface Props {
	className?: string;
}

const GovernanceSwitchDropdown = ({ className } : Props) => {
	const { pathname } = useLocation();
	const cleanPathName = pathname.split('/')[1];

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <Link className='text-sidebarBlue hover:text-pink_primary' to='/'>Governance V1</Link>
		},
		{
			key: '2',
			label: <Link className='text-sidebarBlue hover:text-pink_primary' to="gov-2/">Governance V2</Link>
		}
	];

	return (
		<Dropdown menu={{ items }} trigger={['click']} className={className}>
			<a onClick={e => e.preventDefault()}>
				<div className='flex items-center gap-x-2 group'>
					<span className="text-xs xl:text-base text-sidebarBlue font-semibold group-hover:text-pink_primary">
						{ gov2Routes.includes(cleanPathName) ? 'Governance V2' : 'Governance V1' }
					</span>
					<CaretDownOutlined className='-mt-0.5 group-hover:text-pink_primary' />
				</div>
			</a>
		</Dropdown>
	);
};

export default GovernanceSwitchDropdown;