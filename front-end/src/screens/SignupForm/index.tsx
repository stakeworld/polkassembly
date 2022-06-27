// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { Wallet } from 'src/types';

import Web2Signup from '../../components/Signup/Web2Signup';
import Web3Signup from '../../components/Signup/Web3Signup';

interface Props {
	className?: string
}

const Signup = ({ className }: Props) => {
	const [displayWeb, setDisplayWeb] = useState(2);
	const [chosenWallet, setChosenWallet] = useState<Wallet>();

	const setDisplayWeb2 = () => setDisplayWeb(2);

	const onWalletSelect = (wallet: Wallet) => {
		setChosenWallet(wallet);
		setDisplayWeb(3);
	};

	return (
		<>
			<Grid centered className={className}>
				<Grid.Column mobile={16} tablet={14} computer={8} style={ { minWidth: 'min-content' } }>
					{ displayWeb === 2
						? <Web2Signup onWalletSelect={onWalletSelect} /> : null}

					{displayWeb === 3 && chosenWallet ? <Web3Signup chosenWallet={chosenWallet} setDisplayWeb2={setDisplayWeb2}/> : null}
				</Grid.Column>
			</Grid>
		</>
	);
};

export default Signup;
