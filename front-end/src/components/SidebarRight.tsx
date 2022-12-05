// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Drawer } from 'antd';
import React from 'react';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';
interface Props {
	className?: string;
	children?: ReactNode;
	open: boolean;
	closeSidebar: () => void;
}

const SidebarRight = ({ className, children, open, closeSidebar } : Props) => {
	return (
		<Drawer
			open={open}
			onClose={closeSidebar}
			placement='right'
			className={className}
		>
			<div className='p-3 md:p-6 h-[92vh] overflow-y-auto'>
				{children}
			</div>
		</Drawer>
	);
};

export default styled(SidebarRight)`

.ant-drawer-content-wrapper{
	max-width: 70% !important;
	box-shadow: none !important;
	min-width: 50% !important;

}
.ant-drawer-body{
	padding: 0 !important;

	ul{
		margin-top: 0 !important;
	}
}

.ant-drawer-header-title{
	justify-content: right;
}

`;