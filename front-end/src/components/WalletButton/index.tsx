// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';
import { Button } from 'semantic-ui-react';
interface Props {
	className?: string
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	icon?: JSX.Element
	name: string
	disabled: boolean
}

const WalletButton = ({ className, disabled, onClick, icon, name }: Props) => {
	return (
		<Button className={className} onClick={onClick} disabled={disabled}>
			<span className='wallet-icon'>{icon}</span> <span>{name}</span>
		</Button>
	);
};

export default styled(WalletButton)`
&&& {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	width: 100%;
	margin: 0 8px;
	background-color: transparent;
	border: 1px solid #53595C;
	border-radius: 3px;

	.wallet-icon {
		height: 20px;
		width: 20px;
		margin-right: 8px;
	}

	@media only screen and (max-width: 576px) {
		margin: 4px 0;
	}
}
`;