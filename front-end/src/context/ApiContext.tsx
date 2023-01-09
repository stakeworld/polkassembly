// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line
import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useEffect, useState } from 'react';
import { chainProperties } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

import { typesBundleGenshiro } from '../typesBundle/typeBundleGenshiro';
import { typesBundleCrust } from '../typesBundle/typeBundleCrust';

const NETWORK = getNetwork();

export interface ApiContextType {
	api: ApiPromise | undefined;
	apiReady: boolean;
	wsProvider: string;
	setWsProvider: React.Dispatch<React.SetStateAction<string>>;
}

export const ApiContext: React.Context<ApiContextType> = React.createContext(
	{} as ApiContextType
);

export interface ApiContextProviderProps {
	children?: React.ReactElement;
}

export function ApiContextProvider(
	props: ApiContextProviderProps
): React.ReactElement {
	const { children = null } = props;
	const [api, setApi] = useState<ApiPromise>();
	const [apiReady, setApiReady] = useState(false);
	const [wsProvider, setWsProvider] = useState<string>(chainProperties?.[NETWORK]?.rpcEndpoint || 'wss://kusama-rpc.polkadot.io');

	useEffect(() => {
		const provider = new WsProvider(wsProvider);
		setApiReady(false);
		if (NETWORK == 'genshiro'){
			setApi(new ApiPromise({ provider, typesBundle: typesBundleGenshiro }));
		}
		if (NETWORK == 'crust'){
			setApi(new ApiPromise({ provider, typesBundle: typesBundleCrust }));

		}
		else{
			setApi(new ApiPromise({ provider }));
		}
	},[wsProvider]);

	useEffect(() => {
		if(api){
			api.isReady.then(() => {
				setApiReady(true);
				console.log('API ready');
			})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [api]);

	return (
		<ApiContext.Provider value={{ api, apiReady, setWsProvider, wsProvider }}>
			{children}
		</ApiContext.Provider>
	);
}
