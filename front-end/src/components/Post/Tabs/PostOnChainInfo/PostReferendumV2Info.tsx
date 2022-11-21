// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { useCurrentBlock } from 'src/hooks';
import { OnchainLinkReferendumV2Fragment } from 'src/types';
import Address from 'src/ui-components/Address';
import blockToTime from 'src/util/blockToTime';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkReferendumV2Fragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostReferendumV2Info = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	const currentBlock = useCurrentBlock();
	if (!onchainLink) return null;

	const {
		onchain_referendumv2,
		origin
	} = onchainLink;

	if ( !onchain_referendumv2?.[0] ){
		return null;
	}

	const { deciding, enactmentAfter, enactmentAt, preimage, trackNumber, submitted } = onchain_referendumv2[0];
	const { metaDescription, method, preimageArguments } = preimage || {};

	const formattedBlockToTime = (blockNo: number) => {
		if(!currentBlock) return;

		const time = blockToTime(currentBlock.toNumber() - blockNo);
		const timeArr = time.split(' ');
		const days = Number(timeArr[0].replace('d', ''));
		const hours = Number(timeArr[1].replace('h', ''));
		const minutes = Number(timeArr[2].replace('m', ''));
		const duration = moment.duration({ 'days': days, 'hours': hours, 'minutes': minutes });
		const date = moment().utc().subtract(duration).format('DD MMM YYYY');
		return date;
	};

	return (
		<>
			<OnchainInfoWrapper>
				<Row>
					<Col xs={24} md={12}>
						<h6>Proposer
							<span className='text-pink_primary cursor-pointer ml-3' onClick={() => setOtherProposalsSidebarAddr(submitted.who)}>
								View Other Proposals
							</span>
						</h6>
						<Address address={submitted.who}/>
					</Col>
					{origin &&
						<Col xs={24} md={12}>
							<h6>Origin</h6>
							{origin}
						</Col>
					}
					{trackNumber && <Col xs={24} md={12}>
						<h6>Track</h6>
						{trackNumber}
					</Col>}
					{enactmentAfter &&
						<Col xs={24} md={12}>
							<h6>Enactment After</h6>
							{formattedBlockToTime(Number(enactmentAfter))}
						</Col>
					}
					{enactmentAt &&
						<Col xs={24} md={12}>
							<h6>Enactment At</h6>
							{formattedBlockToTime(Number(enactmentAt))}
						</Col>
					}
					{deciding && deciding.since &&
						<Col xs={24} md={12}>
							<h6>Deciding Since</h6>
							{formattedBlockToTime(deciding.since)}
						</Col>
					}
					{deciding && deciding.confirming &&
						<Col xs={24} md={12}>
							<h6>Confirming</h6>
							{formattedBlockToTime(deciding.confirming)}
						</Col>
					}
					{method &&
					<>
						<Row>
							<Col span={24}>
								<h6>Method</h6>
								{method}
							</Col>
						</Row>
						<div className='arguments max-w-full'>
							{preimageArguments && preimageArguments.length
								? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
								: null}
						</div>
					</>}
					{metaDescription &&
					<Col span={24}>
						<h6>Description</h6>
						<p className='text-navBlue leading-6 whitespace-pre-wrap'>{metaDescription}</p>
					</Col>}
					<Col span={24}>
						{/* TODO: Update for subscan when they have Gov2 */}
						{/* <ExternalLinks isReferendum={true} onchainId={onchainLink.onchain_referendumv2[0]?.referendumId} /> */}
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostReferendumV2Info;