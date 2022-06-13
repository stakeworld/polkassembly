// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';

const WalletButton = ({ onClick, icon, name }: { onClick: () => void, icon?: JSX.Element, name: string }) => {
	return (
		<StyledButton onClick={onClick}>
			{icon} <StyledName>{name}</StyledName>
		</StyledButton>
	);
};

const StyledButton = styled.div`
    padding: 1.25rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid #A9A9A9;

    display: flex;
    align-items: center;

    cursor: pointer;

    transition: 0.3s;

    &:hover {
        border: 2px solid #E5007A;
    }

    margin-bottom: 16px;
`;

const StyledName = styled.span`
    font-size: 16px;
    margin-left: 8px;
    font-weight: 500;
`;

export default WalletButton;