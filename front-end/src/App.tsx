// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProvider } from '@xstyled/styled-components';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Apollo from './components/Apollo';
import CustomSidebar from './components/CustomSidebar';
import Footer from './components/Footer';
import Head from './components/Head';
import MenuBar from './components/MenuBar';
import Modal from './components/Modal';
import Notifications from './components/Notifications';
import SwitchRoutes from './components/SwitchRoutes';
import { ApiContextProvider } from './context/ApiContext';
import { MetaProvider } from './context/MetaContext';
import { ModalProvider } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserDetailsProvider } from './context/UserDetailsContext';
import { theme } from './themes/theme';
import { GlobalStyle } from './ui-components/GlobalStyle';

const App = () => {
	return (
		<>
			<Router>
				<ThemeProvider theme={theme}>
					<NotificationProvider>
						<ModalProvider>
							<UserDetailsProvider>
								<MetaProvider>
									<Apollo>
										<Head />
										<GlobalStyle />
										<Notifications/>
										<Modal/>
										<ApiContextProvider>
											<div id='page-container'>
												<MenuBar />
												<div style={ { display: 'flex' } }>
													<CustomSidebar />
													<div style={ { marginBottom: '6em', marginLeft: '1em', marginRight: '1em', marginTop: '2em',  width:'100%' } }>
														<SwitchRoutes />
													</div>
												</div>
												<Footer />
											</div>
										</ApiContextProvider>
									</Apollo>
								</MetaProvider>
							</UserDetailsProvider>
						</ModalProvider>
					</NotificationProvider>
				</ThemeProvider>
			</Router>
		</>
	);
};

export default App;
