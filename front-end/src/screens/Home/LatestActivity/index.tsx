// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Header, Tab, Table } from 'semantic-ui-react';

interface Props {
  className?: string
}

const LatestActivity = ({ className }: Props) => {
	const panes = [
		{
			menuItem: 'All',
			render: () => <Tab.Pane className='tab-panel'>
				<Table celled padded>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell singleLine>Evidence Rating</Table.HeaderCell>
							<Table.HeaderCell>Effect</Table.HeaderCell>
							<Table.HeaderCell>Efficacy</Table.HeaderCell>
							<Table.HeaderCell>Consensus</Table.HeaderCell>
							<Table.HeaderCell>Comments</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>
							<Table.Cell>
								<Header as='h2' textAlign='center'>
            A
								</Header>
							</Table.Cell>
							<Table.Cell singleLine>Power Output</Table.Cell>
							<Table.Cell>
								1
							</Table.Cell>
							<Table.Cell textAlign='right'>
          80% <br />
								<a href='#'>18 studies</a>
							</Table.Cell>
							<Table.Cell>
          Creatine supplementation is the reference compound for increasing
          muscular creatine levels; there is variability in this increase,
          however, with some nonresponders.
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>
								<Header as='h2' textAlign='center'>
            A
								</Header>
							</Table.Cell>
							<Table.Cell singleLine>Weight</Table.Cell>
							<Table.Cell>
								2
							</Table.Cell>
							<Table.Cell textAlign='right'>
          100% <br />
								<a href='#'>65 studies</a>
							</Table.Cell>
							<Table.Cell>
          Creatine is the reference compound for power improvement, with numbers
          from one meta-analysis to assess potency
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</Tab.Pane>
		},
		{
			menuItem: 'Referenda',
			render: () => <Tab.Pane loading className='tab-panel'>Tab 2 Content</Tab.Pane>
		},
		{
			menuItem: 'Proposals',
			render: () => <Tab.Pane className='tab-panel'>Tab 3 Content</Tab.Pane>
		},
		{
			menuItem: 'Motions',
			render: () => <Tab.Pane className='tab-panel'>Tab 4 Content</Tab.Pane>
		},
		{
			menuItem: 'Treasury Proposals',
			render: () => <Tab.Pane className='tab-panel'>Tab 5 Content</Tab.Pane>
		},
		{
			menuItem: 'Bounties',
			render: () => <Tab.Pane className='tab-panel'>Tab 6 Content</Tab.Pane>
		},
		{
			menuItem: 'Tips',
			render: () => <Tab.Pane className='tab-panel'>Tab 7 Content</Tab.Pane>
		}
	];

	return (
		<div className={className}>
			<h1>Latest activity</h1>
			{/* menu={{ color, inverted: true, }} */}
			<Tab className='tab-header' menu={{ pointing: true, secondary: true }} panes={panes} />
		</div>
	);
};

export default styled(LatestActivity)`
	.tab-header {
		background: white;
		border-top-left-radius: 0.5em;
		border-top-right-radius: 0.5em;
		padding-top: 0.5em;
		margin-left: 0.5em;
	}

	.item:first-child{
		margin-left: 1em !important;
	}

	.item {
		font-size: 1.5em;
	}

	.tab-panel{
		background: white;
		border: none !important;
		width: 90% !important;
		margin-left: 1em;
	}
`;
