// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProvider } from '@xstyled/styled-components';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Apollo from './components/Apollo';
import AppLayout from './components/AppLayout';
import Modal from './components/Modal';
import Notifications from './components/Notifications';
import { ApiContextProvider } from './context/ApiContext';
import { MetaProvider } from './context/MetaContext';
import { ModalProvider } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserDetailsProvider } from './context/UserDetailsContext';
import { MediaContextProvider, mediaStyles } from './Media';
import { theme } from './themes/theme';
import { GlobalStyle } from './ui-components/GlobalStyle';

const App = () => {
	return (
		<>
			<style>{mediaStyles}</style>
			<Router>
				<MediaContextProvider>
					<ThemeProvider theme={theme}>
						<NotificationProvider>
							<ModalProvider>
								<UserDetailsProvider>
									<MetaProvider>
										<Apollo>
											<GlobalStyle />
											<Notifications/>
											<Modal/>
											<ApiContextProvider>
												<AppLayout />
											</ApiContextProvider>
										</Apollo>
									</MetaProvider>
								</UserDetailsProvider>
							</ModalProvider>
						</NotificationProvider>
					</ThemeProvider>
				</MediaContextProvider>
			</Router>
		</>
	);
};

export default App;
