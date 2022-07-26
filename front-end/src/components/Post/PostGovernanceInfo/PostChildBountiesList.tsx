// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Grid, List } from 'semantic-ui-react';

import { OnchainLinkBountyFragment } from '../../../generated/graphql';
import { chainProperties } from '../../../global/networkConstants';
import AddressComponent from '../../../ui-components/Address';
import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';
import getNetwork from '../../../util/getNetwork';

interface Props {
	onchainLink: OnchainLinkBountyFragment
}

const currentNetwork = getNetwork();

const PostChildBountiesList = ({ onchainLink }: Props) => {
	if (!onchainLink) return null;

	const {
		onchain_bounty: onchainBountyProposal
	} = onchainLink;

	const {
		value,
		fee,
		curatorDeposit,
		bond,
		curator,
		beneficiary
	} = onchainBountyProposal?.[0] || { };

	return (
		<OnchainInfoWrapper>
			<h4>Child Bounties</h4>
			<List divided relaxed>
				<List.Item>
					<List.Icon name='github' size='large' verticalAlign='middle' />
					<List.Content>
						<List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
						<List.Description as='a'>Updated 10 mins ago</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name='github' size='large' verticalAlign='middle' />
					<List.Content>
						<List.Header as='a'>Semantic-Org/Semantic-UI-Docs</List.Header>
						<List.Description as='a'>Updated 22 mins ago</List.Description>
					</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name='github' size='large' verticalAlign='middle' />
					<List.Content>
						<List.Header as='a'>Semantic-Org/Semantic-UI-Meteor</List.Header>
						<List.Description as='a'>Updated 34 mins ago</List.Description>
					</List.Content>
				</List.Item>
			</List>
		</OnchainInfoWrapper>
	);
};

export default PostChildBountiesList;
