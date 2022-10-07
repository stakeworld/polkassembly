// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon, Pagination, PaginationProps } from 'semantic-ui-react';

interface Props {
	className?:string
	page: number
	totalPostsCount: number
	limit: number
	handlePaginationChange: (activePage: string | number | undefined) => void
	disabled: boolean
	offset: number
	currDataLength: number
}

const PaginationDiv = ({ className, page, totalPostsCount, limit, handlePaginationChange, disabled, offset, currDataLength }: Props) => {

	const onPaginationChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
		handlePaginationChange(activePage);
	};

	return (
		<div className={`d-flex justify-center ${ className }`}>
			<Pagination
				activePage={page}
				totalPages={Math.ceil(totalPostsCount / limit)}
				onPageChange={onPaginationChange}
				disabled={disabled}
				boundaryRange={1}
				siblingRange={2}
				firstItem={offset > 0 ? { content: <Icon name='angle double left' />, icon: true } : null}
				lastItem={offset + currDataLength < totalPostsCount ? { content: <Icon name='angle double right' />, icon: true } : null}
				prevItem={offset > 0 ? { content: <Icon name='angle left' />, icon: true } : null}
				nextItem={offset + currDataLength < totalPostsCount ? { content: <Icon name='angle right' />, icon: true } : null}
			/>
		</div>
	);
};

export default styled(PaginationDiv)`
	justify-content: center;
	margin-top: 40px;

	.ui.pagination.menu {
		font-size: 1.3rem;
		
		.item {
			min-width: 2em;
		}

		@media only screen and (max-width: 576px) {
			font-size: 0.9rem;
		}
	}
`;