// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoaderGraphic from 'src/assets/lottie-graphics/LoaderGraphic';
import { ApiContext } from 'src/context/ApiContext';

import CustomSidebar from './CustomSidebar';
import Footer from './Footer';
import MenuBar from './MenuBar';
import SwitchRoutes from './SwitchRoutes';

function AppLayout() {
	const location = useLocation();

	const { apiReady } = useContext(ApiContext);
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
			{!apiReady &&
			<div style={ { left: '50vw', position: 'fixed', top: '40vh', transform: 'translate(-50%, 0)', width: '100%', zIndex: 500 } } >
				<LoaderGraphic />
			</div>
			}
			<div style={!apiReady ? { opacity: 0.1 } : {}}>
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

