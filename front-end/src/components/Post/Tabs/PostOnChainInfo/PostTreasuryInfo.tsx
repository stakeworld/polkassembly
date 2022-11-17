// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col,Row } from 'antd';
import * as React from 'react';
import ExternalLinks from 'src/components/ExternalLinks';
import { OnchainLinkTreasuryProposalFragment } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import Address from 'src/ui-components/Address';
import getNetwork from 'src/util/getNetwork';

import OnchainInfoWrapper from './OnchainInfoWrapper';

interface Props{
	onchainLink: OnchainLinkTreasuryProposalFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const currentNetwork = getNetwork();

const PostTreasuryInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_treasury_spend_proposal: onchainTreasuryProposal,
		proposer_address: proposerAddress
	} = onchainLink;
	const beneficiary = onchainTreasuryProposal?.[0]?.beneficiary;
	const value = onchainTreasuryProposal?.[0]?.value;
	const bond = onchainTreasuryProposal?.[0]?.bond;

	return (
		<>
			<OnchainInfoWrapper>
				<Row>
					<Col xs={24} md={12}>
						<h6>Proposer</h6>
						<Address address={proposerAddress}/>
						<div className='text-pink_primary cursor-pointer mt-3' onClick={() => setOtherProposalsSidebarAddr(proposerAddress)}>
							View Other Proposals
						</div>
					</Col>
					{bond && currentNetwork &&
					<Col span={12}>
						<h6>Bond</h6>
						<div className='text-navBlue'>
							{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
						</div>
					</Col>}
					{value && currentNetwork &&
					<Col span={12}>
						<h6>Value</h6>
						<div className='text-navBlue'>{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}</div>
					</Col>}
					{beneficiary &&
					<Col span={12}>
						<h6>Beneficiary</h6>
						<Address address={beneficiary}/>
					</Col>}
					<Col span={24}>
						<ExternalLinks isTreasuryProposal={true} onchainId={onchainLink.onchain_treasury_proposal_id} />
					</Col>
				</Row>
			</OnchainInfoWrapper>
		</>
	);
};

export default PostTreasuryInfo;
