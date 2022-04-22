// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useContext, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import Loader from 'src/ui-components/Loader';

import CustomSidebar from './CustomSidebar';
import Footer from './Footer';
import MenuBar from './MenuBar';
import SwitchRoutes from './SwitchRoutes';

function AppLayout() {
	const { apiReady } = useContext(ApiContext);
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
	const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);

	const toggleSidebarHidden = () => {
		setSidebarHidden(!sidebarHidden);
	};

	return (
		<>
			{!apiReady && <div style={ { left: '50vw', position: 'fixed', top: '50vh', transform: 'translate(-50%, 0)', width: '100%', zIndex: 500 } } ><Loader text='Waiting to make a connection to the remote endpoint and finishing API initialization.' size="big" /></div>}
			<div style={!apiReady ? { opacity: 0.1 } : {}}>
				<MenuBar toggleSidebarHidden={toggleSidebarHidden} />
				<div className='d-flex'>
					<CustomSidebar sidebarHidden={sidebarHidden} setIsCollapsed={setSidebarCollapsed} setSidebarHidden={setSidebarHidden} />
					<div className={`route-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
						<SwitchRoutes />
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

export default AppLayout;

