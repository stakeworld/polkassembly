// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Wallet } from 'src/types';
import styled from 'styled-components';

import { ReactComponent as NovaWalletIcon } from '../../assets/wallet/nova-wallet-star.svg';
import { ReactComponent as PolkadotJSIcon } from '../../assets/wallet/polkadotjs-icon.svg';
import { ReactComponent as SubWalletIcon } from '../../assets/wallet/subwallet-icon.svg';
import { ReactComponent as TalismanIcon } from '../../assets/wallet/talisman-icon.svg';
import WalletButton from '../WalletButton';

interface Props {
	className?: string
	disabled: boolean
	onWalletSelect: (wallet: Wallet) => void
}

const WalletButtons = ({ className, onWalletSelect, disabled } : Props) => {
	function handleWalletClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) {
		event.preventDefault();
		onWalletSelect(wallet);
	}

	return (
		<div className={className}>
			<h6 className='title-heading'>Or Login with a Web3 wallet: </h6>
			<div className="button-row">
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.POLKADOT)} name="Polkadot.js" icon={<PolkadotJSIcon />} />
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.TALISMAN)} name="Talisman" icon={<TalismanIcon />} />
				<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.SUBWALLET)} name="SubWallet" icon={<SubWalletIcon />} />
				{
					(window as any).walletExtension?.isNovaWallet &&
					<WalletButton disabled={disabled} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleWalletClick(event, Wallet.NOVAWALLET)} name="Nova Wallet" icon={<NovaWalletIcon />} />
				}
			</div>
		</div>
	);
};

export default styled(WalletButtons)`
	width: 100%;
	margin-top: 16px;

	.title-heading {
		text-align: center;
		font-size: 1.3rem !important;
		color: #53595C;
	}
	
	.button-row {
		display: flex;
		margin-left: 8px;
		margin-right: 8px;
		margin-top: 12px;

		@media only screen and (max-width: 576px) {
			flex-direction: column;
			max-width: 300px;
			margin-left: auto;
			margin-right: auto;
		}
	}
`;