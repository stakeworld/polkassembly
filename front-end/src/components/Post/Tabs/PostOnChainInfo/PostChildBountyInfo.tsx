// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col, Row } from 'antd';
import React from 'react';
import { OnchainLinkChildBountyFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props {
	onchainLink: OnchainLinkChildBountyFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostChildBountyInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_child_bounty: onchainChildBountyProposal,
		proposer_address: proposerAddress
	} = onchainLink;

	const {
		value,
		fee,
		curatorDeposit,
		curator,
		beneficiary,
		description
	} = onchainChildBountyProposal?.[0] || { };

	return (
		<>
			<OnchainInfoWrapper>
				<Row gutter={40}>
					<Col span={24}>
						<h6>Proposer</h6>
						<Address address={proposerAddress}/>
						<div className='text-pink_primary cursor-pointer mt-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
							View Other Proposals
						</div>
					</Col>
					{curator &&
					<Col xs={24} md={12}>
						<h6>Curator</h6>
						<Address address={curator}/>
					</Col>}
					{beneficiary &&
					<Col xs={24} md={12}>
						<h6>Beneficiary</h6>
						<Address address={beneficiary}/>
					</Col>}
					{value &&
					<Col span={12}>
						<h6>Value</h6>
						<div className='text-navBlue'>
							{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</Col>}
					{fee &&
					<Col span={12}>
						<h6>Fee</h6>
						<div className='text-navBlue'>
							{parseInt(fee) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</Col>}
					{curatorDeposit &&
					<Col span={12}>
						<h6>Curator Deposit</h6>
						<div className='text-navBlue'>
							{parseInt(curatorDeposit) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</Col>}
					{description &&
					<Col span={12}>
						<h6>Description</h6>
						<div className='text-navBlue'>
							{description}
						</div>
					</Col>}
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostChildBountyInfo;
