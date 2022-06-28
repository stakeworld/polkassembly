// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { useState } from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import bifrostLogo from 'src/assets/bifrost-logo.png';
import kiltLogo from 'src/assets/kilt-logo.png';
import kusamaLogo from 'src/assets/kusama-logo.gif';
import moonbeamLogo from 'src/assets/moonbeam-logo.png';
import moonriverLogo from 'src/assets/moonriver-logo.png';
import polkadotLogo from 'src/assets/polkadot-logo.jpg';
import { network } from 'src/global/networkConstants';
import styled from 'styled-components';

function NetworkSelect({ selectedNetwork, setSelectedNetwork }: {selectedNetwork:string, setSelectedNetwork: React.Dispatch<React.SetStateAction<string>>}) {
	const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    text-transform: capitalize;

    img {
			width: 22px;
			border-radius: 50%;
			margin-right: 0.5rem;
    }
`;

	const getNetworkImage = (showNetwork: string) => {
		switch (showNetwork) {
		case network.KUSAMA:
			return kusamaLogo;
		case network.MOONBEAM:
			return moonbeamLogo;
		case network.MOONRIVER:
			return moonriverLogo;
		case network.KILT:
			return kiltLogo;
		case network.BIFROST:
			return bifrostLogo;
		default:
			return polkadotLogo;
		}
	};

	const StyledNetworkItem = ({ showNetwork }: {showNetwork: string}) => {
		return <StyledDiv>
			<img
				src={getNetworkImage(showNetwork)}
				alt={showNetwork}/>
			{showNetwork}
		</StyledDiv>;
	};

	const networkOptions: DropdownItemProps[] = [
		{
			children: <StyledNetworkItem showNetwork={network.POLKADOT}/>,
			value: network.POLKADOT
		},
		{
			children: <StyledNetworkItem showNetwork={network.KUSAMA}/>,
			value: network.KUSAMA
		},
		{
			children: <StyledNetworkItem showNetwork={network.MOONRIVER}/>,
			value: network.MOONRIVER
		},
		{
			children: <StyledNetworkItem showNetwork={network.MOONBEAM}/>,
			value: network.MOONBEAM
		},
		{
			children: <StyledNetworkItem showNetwork={network.KILT}/>,
			value: network.KILT
		},
		{
			children: <StyledNetworkItem showNetwork={network.BIFROST}/>,
			value: network.BIFROST
		}
	];

	const [selectedNetworkToolbar, setSelectedNetworkToolbar] = useState<any>(selectedNetwork);

	const handleSetSelectedNetwork = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedNetworkToolbar(data.value);
		setSelectedNetwork(`${data.value}`);
	};

	return (
		<div className='select-div filter-by-chain-div'>
			<label>Filter by</label>
			<Dropdown compact value={selectedNetworkToolbar} onChange={handleSetSelectedNetwork} options={networkOptions} trigger={<StyledNetworkItem showNetwork={selectedNetwork}/>} />
		</div>
	);
}

export default NetworkSelect;