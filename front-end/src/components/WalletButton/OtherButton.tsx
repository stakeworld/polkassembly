// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';
import { Wallet } from 'src/types';

const OtherButton = ({ handleClick }: {handleClick: (wallet: Wallet) => void}) => {
	return (
		<StyledButton onClick={() => handleClick(Wallet.OTHER)}>
			<StyledName>Other</StyledName>
		</StyledButton>
	);
};

const StyledButton = styled.div`
    padding: 1.25rem 1rem;
    border-radius: 0.75rem;

    display: flex;
    align-items: center;

    cursor: pointer;

    transition: 0.3s;

    background-color: #f2f2f2;

    &:hover {
        background-color: #e4e4e4;
    }
`;

const StyledName = styled.span`
    font-size: 16px;
    margin-left: 8px;
    font-weight: 500;
`;

export default OtherButton;