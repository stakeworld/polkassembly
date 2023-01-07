// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { MenuProps, Space } from 'antd';
import { Dropdown } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
// import { useGetBlockchainEndpointsQuery } from 'src/generated/graphql';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
	setSidebarHiddenFunc?: () => void
}

const NETWORK = getNetwork();

const PolkadotRPCEndpoints = [
	{
		display_label: 'via On-finality',
		endpoint: 'wss://polkadot.api.onfinality.io/public-ws'
	},
	{
		display_label: 'via Dwellir',
		endpoint: 'wss://polkadot-rpc.dwellir.com'
	},
	{
		display_label: 'via Parity',
		endpoint: 'wss://rpc.polkadot.io'
	},
	{
		display_label: 'via Pinknode',
		endpoint: 'wss://public-rpc.pinknode.io/polkadot'
	}
];

const KusamaRPCEndpoints = [
	{
		display_label: 'via On-finality',
		endpoint: 'wss://kusama.api.onfinality.io/public-ws'
	},
	{
		display_label: 'via Dwellir',
		endpoint: 'wss://kusama-rpc.dwellir.com'
	},
	{
		display_label: 'via Parity',
		endpoint: 'wss://kusama-rpc.polkadot.io'
	},
	{
		display_label: 'via Pinknode',
		endpoint: 'wss://public-rpc.pinknode.io/kusama'
	}
];

let rpcEndpoints = PolkadotRPCEndpoints;
if(NETWORK === 'kusama'){
	rpcEndpoints = KusamaRPCEndpoints;
}

const RPCDropdown = ({ className }: Props) => {
	const { wsProvider, setWsProvider } = useContext(ApiContext);
	const [endpoint, setEndpoint] = useState<string>(wsProvider);
	const [RPCOptions, setRPCOptions] = useState<MenuProps['items']>([]);

	useEffect(() => {
		let cancel = false;
		if(cancel) return;

		const items: MenuProps['items'] = [
			{
				label: <span className='text-[12px]'>RPC Endpoints</span>,
				type: 'group'
			},
			{
				type: 'divider'
			}
		];

		rpcEndpoints.forEach((endpointData) => {
			const optionObj = {
				key: endpointData.endpoint,
				label: endpointData.display_label
			};

			items.push(optionObj);
		});

		setRPCOptions(items);

		return () => {
			cancel = true;
		};

	}, []);

	const dropdownLabel = () => {
		let label = '';

		KusamaRPCEndpoints.some((endpointData) => {
			if(endpointData.endpoint == endpoint){
				label = `${endpointData.display_label?.substring(4, endpointData.display_label.length)}`;
				return true;
			}
		});

		return <span className='min-w-[75px]'>{label}</span>;
	};

	const handleEndpointChange: MenuProps['onClick'] = ({ key }) => {
		if(endpoint == `${key}`) return;

		setEndpoint(`${key}`);
		setWsProvider(`${key}`);
	};

	return (
		<Dropdown
			trigger={['click']}
			menu={{ items: RPCOptions, onClick: handleEndpointChange }}
			className={className}
		><Space className='text-navBlue hover:text-pink_primary font-medium cursor-pointer'>{dropdownLabel()}<DownOutlined className='align-middle' /></Space></Dropdown>
	);
};

export default RPCDropdown;
