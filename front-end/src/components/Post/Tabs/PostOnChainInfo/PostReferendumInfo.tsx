// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import * as moment from 'moment';
import * as React from 'react';
import BlockCountdown from 'src/components/BlockCountdown';
import BlocksToTime from 'src/components/BlocksToTime';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkReferendumFragment } from 'src/generated/graphql';
import Address from 'src/ui-components/Address';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkReferendumFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostReferendumInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_referendum: onchainReferendum,
		proposer_address: proposerAddress
	} = onchainLink;

	if ( !onchainReferendum?.[0] ){
		return null;
	}

	const { delay, end, referendumStatus, preimage, voteThreshold } = onchainReferendum[0];
	const { metaDescription, method, preimageArguments } = preimage || {};
	const { blockNumber, status } = referendumStatus?.[0] || {};

	return (
		<>
			<OnchainInfoWrapper>
				<Row>
					<Col span={24}>
						<h6>Proposer</h6>
						<Address address={proposerAddress}/>
						<div className='text-pink_primary cursor-pointer mt-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
							View Other Proposals
						</div>
					</Col>
					{method &&
						<Col span={12}>
							<h6>Method</h6>
							<div className='text-navBlue'>{method}</div>
						</Col>
					}
					{end &&
						<Col span={12}>
							{status === 'Started'
								?
								<>
									<h6>End</h6>
									<BlockCountdown className='text-navBlue' endBlock={end}/>
								</>
								:
								<>
									<h6>Ended</h6>
									<div className='text-navBlue'>{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}</div>
								</>
							}
						</Col>}
					{(delay || delay === 0) &&
						<Col span={12}>
							<h6>Delay</h6>
							<div className='text-navBlue'><BlocksToTime blocks={delay} /></div>
						</Col>}
					{voteThreshold &&
						<Col span={12}>
							<h6>Vote threshold</h6>
							<div className='text-navBlue'>{voteThreshold}</div>
						</Col>}
					{method &&
					<>
						<div className='arguments max-w-full'>
							{preimageArguments && preimageArguments.length
								? <ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
								: null}
						</div>
					</>}
					{metaDescription &&
					<Col span={24}>
						<h6>Description</h6>
						<p className='text-navBlue leading-6'>{metaDescription}</p>
					</Col>}
					<Col span={24}>
						<ExternalLinks isReferendum={true} onchainId={onchainLink.onchain_referendum_id} />
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostReferendumInfo;