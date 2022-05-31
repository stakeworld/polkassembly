// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect,useState } from 'react';
import { Grid } from 'semantic-ui-react';
import WalletButton from 'src/components/WalletButton';
import { Wallet } from 'src/types';
import Modal from 'src/ui-components/Modal';

import { ReactComponent as PolkadotJSIcon } from '../../assets/wallet/polkadotjs-icon.svg';
import { ReactComponent as SubWalletIcon } from '../../assets/wallet/subwallet-icon.svg';
import { ReactComponent as TalismanIcon } from '../../assets/wallet/talisman-icon.svg';
import Web2Login from '../../components/Login/Web2Login';
import Web3Login from '../../components/Login/Web3Login';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useRouter } from '../../hooks';

interface Props {
	className?: string
}

const Login = ({ className }: Props) => {
	const currentUser = useContext(UserDetailsContext);
	const { history } = useRouter();
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

	useEffect(() => {
		if (currentUser?.id) {
			history.push('/');
		}
	}, [history, currentUser, currentUser?.id]);

	return (
		<>
			<Grid centered className={className}>
				<Grid.Column width={10}>
					{ displayWeb === 2
						? <Web2Login setDisplayWeb3={setDisplayWeb3}/> : null}

					{displayWeb === 3 && chosenWallet ? <Web3Login chosenWallet={chosenWallet} setDisplayWeb2={setDisplayWeb2}/> : null}
				</Grid.Column>
			</Grid>

			<Modal size="mini" open={showWalletModal} onClose={() => setShowWalletModal(false)}>
				<WalletButton onClick={() => onWalletSelect(Wallet.POLKADOT)} name="Polkadot.js" icon={<PolkadotJSIcon />} />
				<WalletButton onClick={() => onWalletSelect(Wallet.TALISMAN)} name="Talisman" icon={<TalismanIcon />} />
				<WalletButton onClick={() => onWalletSelect(Wallet.SUBWALLET)} name="SubWallet" icon={<SubWalletIcon />} />
				<WalletButton onClick={() => onWalletSelect(Wallet.OTHER)} name="Other" />
			</Modal>
		</>
	);
};

export default Login;
