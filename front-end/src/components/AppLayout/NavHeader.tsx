// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import NetworkDropdown from 'src/ui-components/NetworkDropdown';
import SearchBar from 'src/ui-components/SearchBar';
import styled  from 'styled-components';

import { ReactComponent as PALogoBlack } from '../../assets/pa-logo-black.svg';
import GovernanceSwitchButton from './GovernanceSwitchButton';
import { gov2Routes } from './SwitchRoutes';

interface Props {
	className?: string
	sidedrawer: boolean
	setSidedrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const NavHeader = ({ className, sidedrawer, setSidedrawer } : Props) => {
	const currentUser = useUserDetailsContext();
	const { pathname } = useLocation();
	const { username } = currentUser;

	const isGov2Route: boolean = gov2Routes.includes(pathname.split('/')[1]);

	return (
		<Header className={`${className} sticky top-0 flex items-center bg-white h-[60px] max-h-[60px] px-6 z-50 leading-normal shadow-sm`}>
			<MenuOutlined className='lg:hidden mr-5' onClick={() => {
				setSidedrawer(!sidedrawer);
			}} />
			<nav className='w-full lg:w-5/6 lg:mx-auto flex items-center justify-between'>
				<Link className='flex' to={isGov2Route ? '/gov-2' : '/'}><PALogoBlack /></Link>

				<div className="flex items-center justify-between w-max lg:w-[82%] xl:w-[63%] 2xl:w-[55%]">
					<GovernanceSwitchButton className='hidden lg:flex min-w-[120px] mr-6 lg:mr-5 xl:mr-0' />

					<Space className='flex items-center justify-between'>
						<SearchBar/>
						<Link className='text-navBlue hidden hover:text-pink_primary text-lg items-center mr-4' to='/notification-settings'>
							<BellOutlined />
						</Link>
						<NetworkDropdown setSidedrawer={setSidedrawer} />
						{!username
							&& <div className='flex items-center lg:gap-x-2 ml-2 lg:ml-4'>
								<Link className='text-navBlue hover:text-pink_primary font-medium' onClick={() => {setSidedrawer(false);}} to='/login'>Login</Link>
							</div>
						}
					</Space>
				</div>

			</nav>
		</Header>
	);
};

export default styled(NavHeader)`
		.gsc-control-cse {
			background: transparent !important;
			border: none !important;
			padding: 0 !important;
		}
		.gsc-search-button {
			display: none;
		}
		.gsc-input-box {
			border: none !important;
			background: none !important;
			width: 15rem;
			margin-right: 1em;
		}
		table.gsc-search-box {
			margin-bottom: 0 !important;
		}
		table.gsc-search-box td.gsc-input {
			padding-right: 0 !important;
		}
		.gsib_a {
			padding: 0 !important;
			position: relative !important;
		}
		.gsib_a input.gsc-input {
			background-color: #f0f2f5 !important;
			padding: 10px 10px 10px 30px !important;
			font-size: 1em !important;
			height: 40px !important;
			border-radius: 6px !important;
			color: #334d6e !important;
		}
		.gsib_b {
			display: none !important;
		}
		form.gsc-search-box {
			margin-bottom: 0 !important;
		}
`;