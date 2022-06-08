// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Table } from 'semantic-ui-react';

interface LatestActivityTableHeaderProps {
	className?: string
	hideSerialNum?: boolean
}

const LatestActivityTableHeader = function ({
	className,
	hideSerialNum
}:LatestActivityTableHeaderProps) {

	return (
		<Table.Header className={`${className}`}>
			<Table.Row>
				{!hideSerialNum ? <Table.HeaderCell><span className='title'>#</span></Table.HeaderCell> : null }
				<Table.HeaderCell width={6}><span>Title</span></Table.HeaderCell>
				<Table.HeaderCell width={3}><span>Posted By</span></Table.HeaderCell>
				<Table.HeaderCell width={2}><span>Type</span></Table.HeaderCell>
				<Table.HeaderCell width={2}><span>Status</span></Table.HeaderCell>
				<Table.HeaderCell width={2}><span>Actions</span></Table.HeaderCell>
			</Table.Row>
		</Table.Header>
	);
};

export default styled(LatestActivityTableHeader)`
	position: sticky;
	top: 0;
	z-index: 200;

	tr {
		height: 60px;
    min-height: 60px;
	}

	th {
		font-weight: 500 !important;
		padding-top: 1.5em;
		padding-bottom: 1.5em;
		
		:first-child {
			padding: 0 !important;
			min-width: 50px;
			text-align: center !important;
		}

		:not(:first-child){
			span {
				border-left: 1px solid #ddd;
				padding: 0.3em 0 0.3em 1em;
				margin-left: -1em;
			}
		}

		&:first-child {
			padding-right: 0 !important;
			width: 120px !important;
		}
	}
`;
