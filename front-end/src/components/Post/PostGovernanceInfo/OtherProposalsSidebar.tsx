// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon } from 'semantic-ui-react';

import AddressComponent from '../../../ui-components/Address';

interface Props {
  className?: string
	routeWrapperHeight: number
	closeOtherProposalsSidebar: () => void
	proposerAddress: string
}

const OtherProposalsSidebar = ({ className, routeWrapperHeight, closeOtherProposalsSidebar, proposerAddress }:Props) => {
	return (
		<div className={className} style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>
			<div className="d-flex other-proposals-heading">
				<div className='d-flex heading-text'>Proposals by <span className='addr-cont'><AddressComponent address={proposerAddress}/></span></div>
				<Icon className='close-icon' name='close' onClick={closeOtherProposalsSidebar} />
			</div>

			{
				[1,2,3,4].map(post => (
					<div className='post-card' key={post}>
						{post} ID
					</div>
				))
			}
		</div>
	);
};

export default styled(OtherProposalsSidebar)`
	position: absolute;
	min-width: 250px;
	width: 700px;
	min-width: 30vw;
	max-width: 55vw;
	right: 0;
	top: 6.5rem;
	background: #fff;
	z-index: 100;
	padding: 40px 24px;
	box-shadow: -5px 0 15px -12px #888;
	overflow-y: auto;

	@media only screen and (max-width: 768px) {
		max-width: 90vw;
		top: 0;
		padding: 40px 14px;
		padding-top: 70px;
		overflow-y: auto;
	}

	.other-proposals-heading {
		align-items: center;
		justify-content: space-between;
		width: 100%;
		font-size: 24px;
		font-weight: 500;
		color: #222;

		.heading-text {
			align-items: center;
		}

		.addr-cont {
			margin-left: 14px;

			.description {
				font-size: 22px;
			}
		}

		.close-icon {
			cursor: pointer;
			font-size: 16px;
			color: #999;

			&:hover {
				color: #333;
			}
		}
	}

	.post-card {
		border: 1px #eee solid;
		margin-top: 24px;
		border-radius: 4px;
		padding: 14px;
	}
`;