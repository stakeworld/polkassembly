// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';
import LatestActivityEmptyState from 'src/assets/lottie-graphics/LatestActivityEmptyState';

interface Props {
	className?: string;
}

const NoLatestActivity = ({ className }: Props) => {
	return (
		<NoLatestActivityContainer className={className}><LatestActivityEmptyState /></NoLatestActivityContainer>
	);
};

export const NoLatestActivityContainer = styled.div`
	min-height: 150px;
`;

export default styled(NoLatestActivity)`
	background-color: grey_border;
	padding: 2rem 3rem 3rem 3rem;
	border-radius: 3px;
	font-size: md;
	margin-bottom: 1rem;
	text-align: center;
	@media only screen and (max-width: 768px) {
		padding: 2rem;
		font-size: sm;
	}

	.icon {
		display: block;
		font-size: xl;
		margin: 1rem auto;
		@media only screen and (max-width: 768px) {
			margin: 0.5rem auto;
		}
	}
`;
