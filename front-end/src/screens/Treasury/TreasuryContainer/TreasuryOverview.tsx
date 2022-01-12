// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import { BN_MILLION,BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import BN from 'bn.js';
import React, { useContext,useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { useBlockTime } from 'src/hooks';
import Card from 'src/ui-components/Card';
import blockToTime from 'src/util/blockToTime';

import Loader from '../../../ui-components/Loader';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
	value?: Balance;
	burn?: BN;
	spendPeriod: BN;
	treasuryAccount: Uint8Array;
}

const TreasuryOverview = () => {

	const { api, apiReady } = useContext(ApiContext);
	const [currentBlock, setCurrentBlock] = useState<BN>(new BN(0));
	const [treasuryBalance, setTreasuryBalance] = useState<DeriveBalancesAccount | undefined>(undefined);

	const { blocktime } = useBlockTime();

	const [result, setResult] = useState<Result>(() => ({
		spendPeriod: BN_ZERO,
		treasuryAccount: u8aConcat(
			'modl', 'py/trsry',
			EMPTY_U8A_32
		).subarray(0, 32)
	}));

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.derive.chain.bestNumber((number) => {
			setCurrentBlock(number);

		});

		api.derive.balances?.account(u8aToHex(result.treasuryAccount)).then(treasuryBalance => {
			setTreasuryBalance(treasuryBalance);

		});

		if (treasuryBalance) {
			setResult(() => ({
				burn: treasuryBalance.freeBalance.gt(BN_ZERO) && !api.consts.treasury.burn.isZero()
					? api.consts.treasury.burn.mul(treasuryBalance.freeBalance).div(BN_MILLION)
					: BN_ZERO,
				spendPeriod: api.consts.treasury
					? api.consts.treasury.spendPeriod
					: BN_ZERO,
				treasuryAccount: u8aConcat(
					'modl',
					api.consts.treasury && api.consts.treasury.palletId
						? api.consts.treasury.palletId.toU8a(true)
						: 'py/trsry',
					EMPTY_U8A_32),
				value: treasuryBalance.freeBalance.gt(BN_ZERO)
					? treasuryBalance.freeBalance
					: undefined
			}));}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, treasuryBalance, currentBlock]);

	return(
		<>
			{treasuryBalance ?
				<Card>
					<Grid columns={4} divided>
						<Grid.Row>
							<Grid.Column>
								<h6>Available</h6>
								{result.value ? <div>{(Math.abs(Number(result.value.toString())) / 1.0e+6).toFixed(2) + 'M'}</div> : <div><Loader/></div>}
							</Grid.Column>
							<Grid.Column>
								<h6>Spend Period</h6>
								<div>{blockToTime(result.spendPeriod.toNumber(), blocktime)}</div>
							</Grid.Column>
							<Grid.Column>
								<h6>Next Burn</h6>
								{result.burn ? <div>{(Math.abs(Number(result.value?.toString())) / 1.0e+6).toFixed(2) + 'M'}</div> : <div><Loader/></div>}
							</Grid.Column>
							<Grid.Column>
								<h6>Count Down</h6>
								{!currentBlock.isZero() ? <div>{blockToTime(currentBlock.toNumber() % (result.spendPeriod.toNumber()), blocktime)}</div> : <Loader/>}
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card>
				:
				<Loader/>}
		</>
	);
};

export default TreasuryOverview;
