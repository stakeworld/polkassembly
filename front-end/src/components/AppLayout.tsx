// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CustomSidebar from './CustomSidebar';
import Footer from './Footer';
import MenuBar from './MenuBar';
import SwitchRoutes from './SwitchRoutes';

function AppLayout() {
	const location = useLocation();

	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
	const [sidebarHidden, setSidebarHidden] = useState<boolean>(true);

	const toggleSidebarHidden = () => {
		setSidebarHidden(!sidebarHidden);
	};

	useEffect(() => {
		if(!sidebarHidden) {
			document.querySelector('body')?.classList.remove('enable-scroll-sm');
			document.querySelector('body')?.classList.add('disable-scroll-sm');
		}else {
			document.querySelector('body')?.classList.remove('disable-scroll-sm');
			document.querySelector('body')?.classList.add('enable-scroll-sm');
		}
	}, [sidebarHidden]);

	const closeSidebar = () => {
		setSidebarHidden(true);
	};

	return (
		<>
			<div>
				<MenuBar toggleSidebarHidden={toggleSidebarHidden} setSidebarHidden={setSidebarHidden} />
				<div className='d-flex'>
					<CustomSidebar sidebarHidden={sidebarHidden} setIsCollapsed={setSidebarCollapsed} setSidebarHidden={setSidebarHidden} />
					<div onClick={closeSidebar} id='route-wrapper' className={`route-wrapper ${location.pathname == '/calendar' ? 'no-margin-sm' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
						<SwitchRoutes />
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default AppLayout;

