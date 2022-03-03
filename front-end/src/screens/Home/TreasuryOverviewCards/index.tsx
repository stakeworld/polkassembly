// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import { BN_MILLION, BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { Card, Icon, Progress } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { useBlockTime } from 'src/hooks';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import blockToTime from 'src/util/blockToTime';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';
import styled from 'styled-components';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
	value?: Balance;
	burn?: BN;
	spendPeriod: BN;
	treasuryAccount: Uint8Array;
}

const NETWORK = getNetwork();

const TreasuryOverviewCards = ({ className }: {className?: string}) => {
	const { api, apiReady } = useContext(ApiContext);
	const [currentBlock, setCurrentBlock] = useState<BN>(new BN(0));
	const [treasuryBalance, setTreasuryBalance] = useState<
		DeriveBalancesAccount | undefined
	>(undefined);

	const { blocktime } = useBlockTime();

	function getNetworkTokenSymbol(network:string){
		let symbol = 'DOT';

		switch (network){
		case 'kusama':
			symbol = 'KSM';
			break;
		default:
			symbol = 'DOT';
		}

		return symbol;
	}

	const [result, setResult] = useState<Result>(() => ({
		spendPeriod: BN_ZERO,
		treasuryAccount: u8aConcat('modl', 'py/trsry', EMPTY_U8A_32).subarray(
			0,
			32
		)
	}));

	const [resultValue, setResultValue] = useState<String>('0');
	const [resultBurn, setResultBurn] = useState<String>('0');
	const [availableUSD, setAvailableUSD] = useState<String>('');
	const [nextBurnUSD, setNextBurnUSD] = useState<String>('');
	const [currentTokenPrice, setCurrentTokenPrice] = useState<String>('');
	const [spendPeriodPercentage, setSpendPeriodPercentage] = useState<number>(0);

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

		api.derive.balances
			?.account(u8aToHex(result.treasuryAccount))
			.then((treasuryBalance) => {
				setTreasuryBalance(treasuryBalance);
			});

		if (treasuryBalance) {
			setResult(() => ({
				burn:
					treasuryBalance.freeBalance.gt(BN_ZERO) &&
					!api.consts.treasury.burn.isZero()
						? api.consts.treasury.burn
							.mul(treasuryBalance.freeBalance)
							.div(BN_MILLION)
						: BN_ZERO,
				spendPeriod: api.consts.treasury
					? api.consts.treasury.spendPeriod
					: BN_ZERO,
				treasuryAccount: u8aConcat(
					'modl',
					api.consts.treasury && api.consts.treasury.palletId
						? api.consts.treasury.palletId.toU8a(true)
						: 'py/trsry',
					EMPTY_U8A_32
				),
				value: treasuryBalance.freeBalance.gt(BN_ZERO)
					? treasuryBalance.freeBalance
					: undefined
			}));

			if (result.value) {
				setResultValue(result.value.toString());
			}

			if (result.burn) {
				setResultBurn(result.burn.toString());
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, treasuryBalance, currentBlock]);

	function formatUSDWithUnits (usd:String) {
		// Nine Zeroes for Billions
		const formattedUSD = Math.abs(Number(usd)) >= 1.0e+9

			? (Math.abs(Number(usd)) / 1.0e+9).toFixed(2) + 'B'
		// Six Zeroes for Millions
			: Math.abs(Number(usd)) >= 1.0e+6

				? (Math.abs(Number(usd)) / 1.0e+6).toFixed(2) + 'M'
			// Three Zeroes for Thousands
				: Math.abs(Number(usd)) >= 1.0e+3

					? (Math.abs(Number(usd)) / 1.0e+3).toFixed(2) + 'K'

					: Math.abs(Number(usd));

		return formattedUSD.toString();

	}

	// fetch available token to USD price whenever available token changes
	useEffect(() => {
		// replace spaces returned in string by format function
		const token_available: number = parseFloat(formatBnBalance(
			resultValue.toString(),
			{
				numberAfterComma: 2,
				withUnit: false
			}
		).replaceAll(/\s/g,''));

		async function fetchAvailableUSDCPrice(token: number) {
			const response = await fetch(
				'https://'+NETWORK+'.api.subscan.io/api/open/price_converter',
				{
					body: JSON.stringify({
						from: getNetworkTokenSymbol(NETWORK),
						quote: 'USD',
						value: token
					}),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-API-Key': 'cf41f0b0e400974bc0a3db0455ce9e11'
					},
					method: 'POST'
				}
			);
			const responseJSON = await response.json();
			if (responseJSON['message'] == 'Success') {
				const formattedUSD = formatUSDWithUnits(responseJSON['data']['output']);
				setAvailableUSD(formattedUSD);
			}
		}

		fetchAvailableUSDCPrice(token_available);
	}, [resultValue]);

	// fetch Next Burn token to USD price whenever Next Burn token changes
	useEffect(() => {
		// replace spaces returned in string by format function
		const token_burn: number = parseFloat(formatBnBalance(
			resultBurn.toString(),
			{
				numberAfterComma: 2,
				withUnit: false
			}
		).replaceAll(/\s/g,''));

		async function fetchNextBurnUSDCPrice(token: number) {
			const response = await fetch(
				'https://'+NETWORK+'.api.subscan.io/api/open/price_converter',
				{
					body: JSON.stringify({
						from: getNetworkTokenSymbol(NETWORK),
						quote: 'USD',
						value: token
					}),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-API-Key': 'cf41f0b0e400974bc0a3db0455ce9e11'
					},
					method: 'POST'
				}
			);
			const responseJSON = await response.json();
			if (responseJSON['message'] == 'Success') {
				const formattedUSD = formatUSDWithUnits(responseJSON['data']['output']);
				setNextBurnUSD(formattedUSD);
			}
		}

		fetchNextBurnUSDCPrice(token_burn);
	}, [resultBurn]);

	// fetch current price of the token
	useEffect(() => {
		async function fetchCurrentTokenPrice() {
			let today = new Date();
			const offset = today.getTimezoneOffset();
			today = new Date(today.getTime() - (offset*60*1000));

			const response = await fetch(
				'https://'+NETWORK+'.api.subscan.io/api/scan/price/history',
				{
					body: JSON.stringify({
						end: `${today.toISOString().split('T')[0]}`,
						start: `${today.toISOString().split('T')[0]}`
					}),
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-API-Key': 'cf41f0b0e400974bc0a3db0455ce9e11'
					},
					method: 'POST'
				}
			);
			const responseJSON = await response.json();
			if (responseJSON['message'] == 'Success') {
				setCurrentTokenPrice(responseJSON['data']['average']);
			}
		}

		fetchCurrentTokenPrice();
	}, []);

	// TODO: calculate the percentage of spending period.
	useEffect(() => {
		// const twentyFourDaystoSeconds = 2.074e+6;
		const currentDHM = blockToTime(
			result.spendPeriod.toNumber(),
			blocktime
		);
		console.log('currentDHM : ', currentDHM);
		setSpendPeriodPercentage(75);
	}, [blocktime, result.spendPeriod]);

	return (
		<Card.Group className={className}>
			{/* Available Card */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						Available <HelperTooltip content='Available funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.' />
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{result.value ? (
							<span>
								{formatBnBalance(
									result.value.toString(),
									{
										numberAfterComma: 2,
										withUnit: true
									}
								)}
							</span>
						) : (
							<div>
								<Icon loading name='circle notched' />
							</div>
						)}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{availableUSD
							? `~ $${availableUSD}`
							: 'loading...'}
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Current Price Card */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
						Current Price of DOT
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{currentTokenPrice ?
							`$${currentTokenPrice}` :
							<div><Icon loading name='circle notched' /></div>
						}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{result.value
							? 'Weekly Change'
							: 'loading...'}
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Spend Period Remaining */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
					Spend Period Remaining
						<HelperTooltip content='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.' />
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{blockToTime(
							result.spendPeriod.toNumber(),
							blocktime
						)}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{/* TODO: Check on how to calculate for every network */}
						{/* <div className='progressNumber'>75%</div><br/> */}
						<Progress percent={spendPeriodPercentage} progress />
					</Card.Description>
				</Card.Content>
			</Card>

			{/* Next Burn */}
			<Card className='treasury-card'>
				<Card.Content>
					<Card.Meta className='treasury-card-meta'>
					Next Burn
						<HelperTooltip content='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.' />
					</Card.Meta>
					<Card.Header className='treasury-card-header'>
						{result.burn ? (
							<h6>
								{formatBnBalance(
									result.burn.toString(),
									{
										numberAfterComma: 2,
										withUnit: true
									}
								)}
							</h6>
						) : (
							<div>
								<Icon loading name='circle notched' />
							</div>
						)}
					</Card.Header>

					<Card.Description className='treasury-card-desc'>
						{nextBurnUSD
							? `~ $${nextBurnUSD}`
							: 'loading...'}
					</Card.Description>
				</Card.Content>
			</Card>
		</Card.Group>
	);
};

export default styled(TreasuryOverviewCards)`
	&&& {
		.treasury-card{
			border-radius: 0.5em;
			
			.content{
				padding-bottom: 0 !important;
			}
		}
		
		.treasury-card-meta {
			color: #333 !important;
			font-size: 1.5rem;
		}

		.treasury-card-header {
			margin-top: 0.4em !important;
		}

		.treasury-card-desc{
			border-top: 1px solid #eee;
			padding-top: 0.5em;

			.bar {
				background-color: #E5007A !important;
				border-radius: 1em;
				height: 1.5em;
				margin-top: 0.5em;
			}


			.progressNumber{
				float: right;
			}

		}
	}
`;
