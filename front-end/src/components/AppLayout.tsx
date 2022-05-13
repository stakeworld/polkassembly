// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiContext } from 'src/context/ApiContext';
import Button from 'src/ui-components/Button';
import Loader from 'src/ui-components/Loader';

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

	const closeSidebar = () => {
		setSidebarHidden(true);
	};

	const [showLoader, setShowLoader] = useState<boolean>(true);

	return (
		<>
			{!apiReady && showLoader &&
			<div style={ { left: '50vw', position: 'fixed', top: '40vh', transform: 'translate(-50%, 0)', width: '100%', zIndex: 500 } } >
				<Loader text='Waiting to make a connection to the remote endpoint and finishing API initialization.' size="big" />
				<Button onClick={() => setShowLoader(false)} style={ { background: '#fff', color: '#333', left: '50vw', position: 'fixed', top: '15vh', transform: 'translate(-50%, 0)', zIndex: 500 } }>Skip</Button>
			</div>
			}
			<div style={!apiReady && showLoader ? { opacity: 0.1 } : {}}>
				<MenuBar toggleSidebarHidden={toggleSidebarHidden} setSidebarHidden={setSidebarHidden} />
				<div className='d-flex'>
					<CustomSidebar sidebarHidden={sidebarHidden} setIsCollapsed={setSidebarCollapsed} setSidebarHidden={setSidebarHidden} />
					<div onClick={closeSidebar} className={`route-wrapper ${location.pathname == '/calendar' ? 'no-margin-sm' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
						<SwitchRoutes />
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default AppLayout;

