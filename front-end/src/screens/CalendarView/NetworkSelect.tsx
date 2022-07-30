// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { useState } from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import chainLogo from 'src/assets/parachain-logos/chain-logo.jpg';
import { chainProperties, network } from 'src/global/networkConstants';
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

	const StyledNetworkItem = ({ showNetwork }: {showNetwork: string}) => {
		return <StyledDiv>
			<img
				src={chainProperties[showNetwork]?.logo ? chainProperties[showNetwork].logo : chainLogo}
				alt={showNetwork}
			/>
			{showNetwork}
		</StyledDiv>;
	};

	const networkOptions: DropdownItemProps[] = [];
	for (const key of Object.keys(network)) {
		const optionObj = {
			children: <StyledNetworkItem showNetwork={network[key as keyof typeof network]} />,
			value: network[key as keyof typeof network]
		};

		networkOptions.push(optionObj);
	}

	const [selectedNetworkToolbar, setSelectedNetworkToolbar] = useState<any>(selectedNetwork);

	const handleSetSelectedNetwork = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedNetworkToolbar(data.value);
		setSelectedNetwork(`${data.value}`);
	};

	return (
		<div className='select-div filter-by-chain-div'>
			<label>Filter by</label>
			<Dropdown compact scrolling value={selectedNetworkToolbar} onChange={handleSetSelectedNetwork} options={networkOptions} trigger={<StyledNetworkItem showNetwork={selectedNetwork}/>} />
		</div>
	);
}

export default NetworkSelect;
