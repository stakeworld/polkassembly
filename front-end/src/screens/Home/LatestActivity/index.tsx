// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Tab, Table } from 'semantic-ui-react';

import LatestBountiesTable from '../LatestBountiesTable';
import LatestMotionsTable from '../LatestMotionsTable';
import LatestProposalsTable from '../LatestProposalsTable';
import LatestReferendaTable from '../LatestReferendaTable';
import LatestTipsTable from '../LatestTipsTable';
import LatestTreasuryTable from '../LatestTreasuryTable';

interface Props {
  className?: string
}

const LatestActivity = ({ className }: Props) => {
	const panes = [
		{
			menuItem: 'All',
			render: () => <Tab.Pane className='tab-panel'>
				<Table basic='very' striped unstackable>
					<Table.Header className='table-header'>
						<Table.Row>
							<Table.HeaderCell width={7}><span>Title</span></Table.HeaderCell>
							<Table.HeaderCell width={3}><span>Posted By</span></Table.HeaderCell>
							<Table.HeaderCell width={2}><span>Type</span></Table.HeaderCell>
							<Table.HeaderCell width={2}><span>Status</span></Table.HeaderCell>
							<Table.HeaderCell width={2}><span>Actions</span></Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>
							<Table.Cell>John<br/>John</Table.Cell>
							<Table.Cell>Approved</Table.Cell>
							<Table.Cell>None</Table.Cell>
							<Table.Cell>None</Table.Cell>
							<Table.Cell>None</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Jamie</Table.Cell>
							<Table.Cell>Approved</Table.Cell>
							<Table.Cell>Requires call</Table.Cell>
							<Table.Cell>Requires call</Table.Cell>
							<Table.Cell>Requires call</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Jill</Table.Cell>
							<Table.Cell>Denied</Table.Cell>
							<Table.Cell>None</Table.Cell>
							<Table.Cell>None</Table.Cell>
							<Table.Cell>None</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</Tab.Pane>
		},
		{
			menuItem: 'Referenda',
			render: () => <LatestReferendaTable />
		},
		{
			menuItem: 'Proposals',
			render: () => <LatestProposalsTable />
		},
		{
			menuItem: 'Motions',
			render: () => <LatestMotionsTable />
		},
		{
			menuItem: 'Treasury Proposals',
			render: () => <LatestTreasuryTable />
		},
		{
			menuItem: 'Bounties',
			render: () => <LatestBountiesTable />
		},
		{
			menuItem: 'Tips',
			render: () => <LatestTipsTable />
		}
	];

	return (
		<div className={className}>
			<h1>Latest activity</h1>
			<Tab className='tab-header' menu={{ className:'tab-menu', pointing: true, secondary: true }} panes={panes} />
		</div>
	);
};

export default styled(LatestActivity)`
	&&& {
			.tab-header {
				background: white;
				border-top-left-radius: 0.5em;
				border-top-right-radius: 0.5em;
				padding-top: 0.5em;
				margin-left: 0.5em;
			}
		
			.tab-menu {
				overflow-x: auto;
				overflow-y: hidden;
		
				a.active {
					border-bottom: 5px solid #E5007A !important;
				}
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
				width: 100% !important;
				margin-left: 0 !important;
				font-size: 1.5rem;
				overflow-x: auto;
				overflow-y: hidden;
			}
		
			.table-header{
				background: #F2F2F2;
		
				th {
					font-weight: 500 !important;
					padding-top: 1.5em;
					padding-bottom: 1.5em;

					:not(:first-child){
						span {
							border-left: 1px solid #ddd;
							padding 0.3em 0 0.3em 1em;
							margin-left: -1em;
						}
					}
				}
			}
	}
`;
