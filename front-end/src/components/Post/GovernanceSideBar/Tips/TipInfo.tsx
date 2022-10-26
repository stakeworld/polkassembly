// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import NothingFoundCard from 'src/ui-components/NothingFoundCard';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

import Address from '../../../../ui-components/Address';
import Card from '../../../../ui-components/Card';
import Loader from '../../../../ui-components/Loader';

interface Props {
	className?: string
	onChainId: string
	who?: string;
}

const Median = (data: any, members: string[]): [BN, BN, string, string] => {
	let median = new BN(0);
	let findersFee = new BN(0);
	let receiver = '';
	let finder = '';

	if (data?.tips?.length > 0) {
		const values: BN[] = data.tips.map(([, value]: [string, BN]) => value).sort((a: BN, b: BN) => new BN(a).cmp(new BN(b)));
		const midIndex = Math.floor(values.length / 2);
		median = values.length
			? values.length % 2
				? values[midIndex]
				: new BN(values[midIndex - 1]).add(new BN(values[midIndex])).divn(2)
			: new BN(0);
		receiver = data.who;
		finder = data.finder;
		if (data.finder != data.who && !members.includes(data.finder) && median != new BN(0)) {
			findersFee = new BN(median).divn(5); // 20% of median value
			median = new BN(median).sub(findersFee);

		}
	}

	return [median, findersFee, finder, receiver];
};
const Median2 = (list: any[]): [BN] => {
	let median = new BN(0);
	let findersFee = new BN(0);

	if(list&&list.length>0){
		const values: BN[] = list.map((value: any) => {
			return new BN(value?.amount);
		}).sort((a: BN, b: BN) => new BN(a).cmp(new BN(b)));
		const midIndex = Math.floor(values.length / 2);
		median = values.length
			? values.length % 2
				? values[midIndex]
				: new BN(values[midIndex - 1]).add(new BN(values[midIndex])).divn(2)
			: new BN(0);
		if (median != new BN(0)) {
			findersFee = new BN(median).divn(5); // 20% of median value
			median = new BN(median).sub(findersFee);
		}
	}
	return [median];
};

const TipInfo = ({ className, onChainId, who }: Props) => {

	const { api, apiReady } = useContext(ApiContext);
	const [tips, setTips] = useState<any>(null);
	const [isTippersLoading, setIsTippersLoading] = useState(true);
	const [members, setMembers] = useState<string[]>([]);
	const [median, setMedian] = useState<BN>(new BN(0));
	const [median2, setMedian2] = useState<BN>(new BN(0));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [findersFee, setFindersFee] = useState<BN>(new BN(0));
	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [finder, setFinder] = useState<string>('');
	const [receiver, setReceiver] = useState<string>('');
	const [tippers, setTippers] = useState<any[]>([]);

	useEffect(() => {
		if (!api || !apiReady) {
			return;
		}
		let cancel = false;
		api.query.council.members().then((members) => {
			if (cancel) return;
			setMembers(members?.map(member => member.toString()));
		});
		return () => {
			cancel = true;
		};
	},[api, apiReady]);
	useEffect(() => {
		let cancel = false;
		// eslint-disable-next-line quotes
		fetch(`https://${getNetwork()}.api.subscan.io/api/scan/treasury/tippers`, { body: JSON.stringify({ hash: onChainId }) as unknown as BodyInit, method: 'POST' }).then(async (res) => {
			if (cancel) return;
			try {
				const response = await res.json();
				setTippers(response?.data?.list);
				const [adjustedMedian] = Median2(response?.data?.list);
				setMedian2(adjustedMedian);
			} catch (error) {
				setTippers([]);
			}
		}).catch(() => {
			setTippers([]);
		});
		return () => {
			cancel = true;
		};
	},[onChainId]);

	useEffect(() => {
		if (!api || !apiReady || members.length === 0) return;
		let cancel = false;
		api.query.tips.tips.multi([onChainId]).then(tip => {
			if (cancel) return;
			setTips(tip[0]?.toJSON());
			setIsTippersLoading(false);
			const [adjustedMedian, findersFee, finder, receiver] = Median(tip[0]?.toJSON(), members);
			setMedian(adjustedMedian);
			setFindersFee(findersFee);
			setReceiver(receiver);
			setFinder(finder);

		});

		return () => {
			cancel = true;
		};
	}, [api, apiReady, onChainId, members]);

	const pendingTippers = members.filter(item => !tips?.tips.find((tip: any[]) => tip[0] == item));

	return (
		<>
			{tips?.tips.length > 0 ?
				<Card className={className}>
					<h3>Final Tip<HelperTooltip content='The final value of the tip is decided based on the median of all tips issued by the tippers' /></h3>
					<Grid>
						<Grid.Row key={receiver}>
							<Grid.Column width={12}>
								<div className='item'>
									<h6>Receiver</h6>
									<Address address={receiver} />
								</div></Grid.Column>
							<Grid.Column width={4}>
								{formatBnBalance(median, { numberAfterComma: 2, withUnit: true })}
							</Grid.Column>
						</Grid.Row>
					</Grid>
					<h3>Tippers <HelperTooltip content='Amount tipped by an individual/organisation' /></h3>
					<Grid className='tippers'>
						{tips.tips.map((tip: any[]) =>
							<Grid.Row key={tip[0]}>
								<Grid.Column width={12}>
									<div className='item'>
										<Address address={tip[0]} />
									</div>
								</Grid.Column>
								<Grid.Column width={4}>
									{formatBnBalance(tip[1], { numberAfterComma: 2, withUnit: true })}
								</Grid.Column>
							</Grid.Row>
						)}
						{pendingTippers.map((tip: string) =>
							<Grid.Row key={tip}>
								<Grid.Column width={12}>
									<div className='item'>
										<Address address={tip} />
									</div>
								</Grid.Column>
								<Grid.Column width={4}>
									Pending
								</Grid.Column>
							</Grid.Row>
						)}
					</Grid>
				</Card>
				: isTippersLoading ? <Loader text={'Requesting Tippers'} /> : tippers?.length > 0?
					<Card className={className}>
						<h3>Final Tip<HelperTooltip content='The final value of the tip is decided based on the median of all tips issued by the tippers' /></h3>
						<Grid>
							<Grid.Row>
								<Grid.Column width={12}>
									<div className='item'>
										<h6>Receiver</h6>
										<Address address={who || ''} />
									</div></Grid.Column>
								<Grid.Column width={4}>
									{formatBnBalance(median2, { numberAfterComma: 2, withUnit: true })}
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<h3>Tippers <HelperTooltip content='Amount tipped by an individual/organization' /></h3>
						<Grid className='tippers'>
							{tippers?.map((tip: any, index) => {
								if (!tip?.rewarder){
									return null;
								}
								return (
									<Grid.Row key={index}>
										<Grid.Column width={12}>
											<div className="item">
												<Address address={tip?.rewarder?.address} />
											</div>
										</Grid.Column>
										<Grid.Column width={4}>
											{tip?.amount?formatBnBalance(tip?.amount, {
												numberAfterComma: 2,
												withUnit: true
											}):<span className='not-tipped'>Not Tipped</span>}
										</Grid.Column>
									</Grid.Row>
								);
							}
							)}
						</Grid>
					</Card>
					:<NothingFoundCard className={className} text='There are currently no tippers.' />}
		</>
	);
};

export default styled(TipInfo)`
.tippers {
    margin-top: 2em;
}

h3 {
	margin-top:20px;
}

h6 {
	font-family: font_mono;
	font-size: sm;
}
.not-tipped{
	color: red;
}
@media only screen and (max-width: 768px) {
    .ui.form {
        padding: 0rem;
    }
}
`;