// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Pagination, PaginationProps } from 'semantic-ui-react';

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
				firstItem={offset > 0 ? undefined : null}
				lastItem={offset + currDataLength < totalPostsCount ? undefined : null}
				prevItem={offset > 0 ? undefined : null}
				nextItem={offset + currDataLength < totalPostsCount ? undefined : null}
			/>
		</div>
	);
};

export default styled(PaginationDiv)`
	justify-content: center;
	margin-top: 40px;

	.ui.pagination.menu {
		font-size: 1.3rem;
	}
`;