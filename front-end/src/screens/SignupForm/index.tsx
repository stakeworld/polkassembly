// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import NovaButton from 'src/components/WalletButton/NovaButton';
import OtherButton from 'src/components/WalletButton/OtherButton';
import TalismanButton from 'src/components/WalletButton/TalismanButton';
import { Wallet } from 'src/types';
import Modal from 'src/ui-components/Modal';

import Web2Signup from '../../components/Signup/Web2Signup';
import Web3Signup from '../../components/Signup/Web3Signup';

interface Props {
	className?: string
}

const Signup = ({ className }: Props) => {
	const [displayWeb, setDisplayWeb] = useState(2);
	const [chosenWallet, setChosenWallet] = useState<Wallet>();
	const [showWalletModal, setShowWalletModal] = useState(false);

	const setDisplayWeb2 = () => setDisplayWeb(2);

	const setDisplayWeb3 = () => {
		setShowWalletModal(true);
	};

	const onWalletSelect = (wallet: Wallet) => {
		setChosenWallet(wallet);

		setDisplayWeb(3);

		setShowWalletModal(false);
	};

	return (
		<>
			<Grid className={className}>
				<Grid.Column only='tablet computer' tablet={2} computer={4} largeScreen={4} widescreen={4}/>
				<Grid.Column mobile={16} tablet={12} computer={8} largeScreen={8} widescreen={8}>
					{ displayWeb === 2
						? <Web2Signup setDisplayWeb3={setDisplayWeb3}/> : null}

					{displayWeb === 3 && chosenWallet ? <Web3Signup chosenWallet={chosenWallet} setDisplayWeb2={setDisplayWeb2}/> : null}
				</Grid.Column>
			</Grid>

			<Modal size="mini" open={showWalletModal} onClose={() => setShowWalletModal(false)}>
				<TalismanButton handleClick={() => onWalletSelect(Wallet.TALISMAN)}/>
				<NovaButton handleClick={() => onWalletSelect(Wallet.TALISMAN)}/>
				<OtherButton handleClick={() => onWalletSelect(Wallet.OTHER)}/>
			</Modal>
		</>
	);
};

export default Signup;
