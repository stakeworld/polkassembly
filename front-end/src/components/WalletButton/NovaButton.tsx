// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';
import { Wallet } from 'src/types';

const NovaIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 6.62069C0 2.96418 2.96418 0 6.62069 0H17.3793C21.0358 0 24 2.96418 24 6.62069V17.3793C24 21.0358 21.0358 24 17.3793 24H6.62069C2.96418 24 0 21.0358 0 17.3793V6.62069Z" fill="url(#paint0_linear_519_10330)"/>
		<path d="M11.8371 4.07544C11.869 3.89282 12.1311 3.89282 12.1631 4.07544L13.1198 9.53569C13.2401 10.2224 13.7778 10.7601 14.4645 10.8804L19.9247 11.8371C20.1073 11.869 20.1073 12.1311 19.9247 12.1631L14.4645 13.1198C13.7778 13.2401 13.2401 13.7778 13.1198 14.4645L12.1631 19.9247C12.1311 20.1073 11.869 20.1073 11.8371 19.9247L10.8804 14.4645C10.7601 13.7778 10.2224 13.2401 9.53569 13.1198L4.07544 12.1631C3.89282 12.1311 3.89282 11.869 4.07544 11.8371L9.53569 10.8804C10.2224 10.7601 10.7601 10.2224 10.8804 9.53569L11.8371 4.07544Z" fill="white"/>
		<defs>
			<linearGradient id="paint0_linear_519_10330" x1="22.8914" y1="-10.5832" x2="-1.76938e-06" y2="33.9688" gradientUnits="userSpaceOnUse">
				<stop offset="0.205836"/>
				<stop offset="0.369792" stopColor="#541E7E"/>
				<stop offset="0.47142" stopColor="#3F51D1"/>
				<stop offset="0.609119" stopColor="#73AFE3"/>
				<stop offset="0.801091" stopColor="#90D7FF"/>
			</linearGradient>
		</defs>
	</svg>
);

const NovaButton = ({ handleClick }: {handleClick: (wallet: Wallet) => void}) => {
	return (
		<StyledButton onClick={() => handleClick(Wallet.NOVA)}>
			<NovaIcon /> <StyledName>Nova</StyledName>
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

    margin-bottom: 16px;
`;

const StyledName = styled.span`
    font-size: 16px;
    margin-left: 8px;
    font-weight: 500;
`;

export default NovaButton;