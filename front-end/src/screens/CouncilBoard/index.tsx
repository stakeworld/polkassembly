// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';

const CouncilBoardContainer = ({ className } : {className?: string}) => {

	return (
		<div className={className}>
			<h1>Council Board</h1>
		</div>
	);

};

export default styled(CouncilBoardContainer)`

	h1 {
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
`;
