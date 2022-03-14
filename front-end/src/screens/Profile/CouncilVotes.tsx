// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
	ApolloClient,
	ApolloProvider,
	gql,
	InMemoryCache,
	useQuery  } from '@apollo/client';
import styled from '@xstyled/styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';

import FilteredError from '../../ui-components/FilteredError';
import HelperTooltip from '../../ui-components/HelperTooltip';
import Loader from '../../ui-components/Loader';
import getNetwork from '../../util/getNetwork';

interface Props {
	address: string;
	className?: string
}

interface SUBQUERY_LINKS_TYPE {
	[network: string]: string
}

const SUBQUERY_LINKS: SUBQUERY_LINKS_TYPE = {
	kusama: 'https://api.subquery.network/sq/Premiurly/kusama-council-proposals',
	polkadot: 'https://api.subquery.network/sq/subquery/tutorial---councillor-voting'
};

const NETWORK = getNetwork();

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: SUBQUERY_LINKS[NETWORK]
});

const CouncilVotes = ({ className, address } : Props) => {

	const VOTES_QUERY = gql`
		# query {
		# 	councillor (id: "${address}") {
		# 		id
		# 		numberOfVotes
		# 		voteHistory(orderBy:BLOCK_DESC) {
		# 			nodes {
		# 				block
		# 				approvedVote
		# 				votedYes
		# 				votedNo
		# 				proposalHash {
		# 					index
		# 					hash
		# 				}
		# 			}
		# 		}
		# 	}
		# }
	`;

	const { loading, error, data } = useQuery(VOTES_QUERY);

	console.log(data);
	return (
		<div className={className}>
			<h1>Voting History <HelperTooltip content='This represents the onchain votes of council member'/></h1>
			<div>
				{loading ? <Loader text={'Loading...'} /> : null}
				{error ? <FilteredError text={error.message} /> : null}
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Proposal</Table.HeaderCell>
							<Table.HeaderCell>Block</Table.HeaderCell>
							<Table.HeaderCell>Vote</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{data?.councillor?.voteHistory?.nodes?.length
							? data?.councillor?.voteHistory?.nodes.map((node: any) => (
								<Table.Row key={node.block}>
									<Table.Cell>
										<Link to={`/motion/${node?.proposalHash?.index}`}>
											<h3>Motion #{node?.proposalHash?.index}</h3>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<a href={`https://${NETWORK}.subscan.io/block/${node?.block}`}>
											<h6>#{node?.block}</h6>
										</a>
									</Table.Cell>
									<Table.Cell>
										{node?.approvedVote ? <>
											<div className='thumbs up'>
												<Icon name='thumbs up' />
											</div> Aye
										</> : <>
											<div className='thumbs down'>
												<Icon name='thumbs down' />
											</div> Nay
										</>}
									</Table.Cell>
								</Table.Row>
							))
							: null
						}
					</Table.Body>
				</Table>
			</div>
		</div>
	);

};

const StyledCouncilVotes = styled(CouncilVotes)`
	h3 {
		@media only screen and (max-width: 576px) {
			margin: 3rem 1rem 1rem 1rem;
		}

		@media only screen and (max-width: 768px) and (min-width: 576px) {
			margin-left: 1rem;
		}

		@media only screen and (max-width: 991px) and (min-width: 768px) {
			margin-left: 1rem;
		}
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		.ui[class*="tablet reversed"].grid {
			flex-direction: column-reverse;
		}
	}

	.thumbs {
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		color: white;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		font-size: 1rem;
	}

	.thumbs.up {
		background-color: green_primary;
	}

	.thumbs.down {
		background-color: red_primary;
	}
`;

const Container = ({ address }: { address: string }) => {
	return (
		<ApolloProvider client={client}>
			<StyledCouncilVotes address={address} />
		</ApolloProvider>
	);
};

export default Container;