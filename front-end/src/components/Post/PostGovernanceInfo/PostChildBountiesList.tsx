// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, List } from 'semantic-ui-react';
import { useGetChildBountiesOfParentBountyQuery } from 'src/generated/graphql';
import FilteredError from 'src/ui-components/FilteredError';

import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';

interface Props {
	onchainId: number
}

const PostChildBountiesList = ({ onchainId }: Props) => {
	const { data, error, refetch } = useGetChildBountiesOfParentBountyQuery({ variables: { parent_bounty_id: onchainId } });

	const [showMore, setShowMore] = useState<boolean>(false);

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <FilteredError text={error.message}/>;

	return (
		onchainId && data && data.childBounties.length > 0 ?
			<OnchainInfoWrapper>
				<h4>Child Bounties: </h4>

				<List divided relaxed>
					{data.childBounties.slice(0, 5).map((childBounty, i) => (
						<List.Item as={Link} to={`/child_bounty/${childBounty?.childBountyId}`} key={i} className='child-bounty-item'>
							<List.Content>
								<List.Header className='child-bounty-item-header'>#{childBounty?.childBountyId}</List.Header>
								<List.Description>{childBounty?.description}</List.Description>
							</List.Content>
						</List.Item>
					))}
				</List>

				{showMore && <List divided relaxed>
					{data.childBounties.slice(5, data.childBounties.length).map((childBounty, i) => (
						<List.Item as={Link} to={`/child_bounty/${childBounty?.childBountyId}`} key={i} className='child-bounty-item'>
							<List.Content>
								<List.Header className='child-bounty-item-header'>#{childBounty?.childBountyId}</List.Header>
								<List.Description>{childBounty?.description}</List.Description>
							</List.Content>
						</List.Item>
					))}
				</List>}

				{data.childBounties.length > 5 && <Button className='child-bounty-show-btn' onClick={() => setShowMore(!showMore)}>Show {showMore ? 'Less' : 'More'}</Button>}
			</OnchainInfoWrapper>
			: <></>
	);
};

export default PostChildBountiesList;
