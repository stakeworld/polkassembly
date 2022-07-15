// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import chainLogo from 'src/assets/parachain-logos/chain-logo.jpg';
import { chainProperties, network } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();
const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    text-transform: capitalize;

    img {
			width: 2rem;
			@media only screen and (min-width: 992px) {
      	width: 4rem;
			}
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

const NetworkOptions: DropdownItemProps[] = [];

for (const key of Object.keys(network)) {
	const optionObj = {
		children: <StyledNetworkItem showNetwork={network[key as keyof typeof network]} />,
		value: network[key as keyof typeof network]
	};

	NetworkOptions.push(optionObj);
}

interface Props {
    className?: string
		setSidebarHiddenFunc?: () => void
}

const NetworkDropdown = ({ className, setSidebarHiddenFunc }: Props) =>  {

	const navigate = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		if (data.value === NETWORK){
			return null;
		}
		window.location.href = `https://${data.value}.polkassembly.io`;
		return null;
	};

	return <Dropdown
		onClick={setSidebarHiddenFunc}
		className={className}
		pointing='top'
		onChange={navigate}
		options={NetworkOptions}
		trigger={<StyledNetworkItem showNetwork={NETWORK}/>}
		value={NETWORK}
		scrolling
	/>;
};

export default styled(NetworkDropdown)`
    color: #fff;
    display: flex !important;
    align-items: center;
		margin: 0 1.2rem;

		@media only screen and (max-width: 768px) {
			font-size: 13px;
		}

		i.icon {
			color: #fff !important;
		}

		.menu {
			z-index: 201 !important;
			min-height: 70vh !important;
		}
`;
