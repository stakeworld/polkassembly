// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Address from '../../ui-components/Address';
import StatusTag from '../../ui-components/StatusTag';

interface Props {
  className?: string
  data: string[]
  prime: string
}

const Members = ({ className, data, prime }: Props) => {
	return (
		<ul className={`${className} proposals__list`}>
			{data.map(
				(member, i) => (
					<li key={member} className='proposals__item'>
						{<Link to={`/profile/${member}`}>
							<div className='member_card'>
								<Segment.Group horizontal>
									<Segment className='index'>
										<h5>#{i + 1}</h5>
									</Segment>
									<Segment>
										<Address
											address={member}
											className='address'
										/>
										{prime === member  ? <StatusTag className='statusTag' status={'prime'} /> : null }
									</Segment>
								</Segment.Group>
							</div>
						</Link>}
					</li>
				)
			)}
		</ul>
	);
};

export default styled(Members)`
	margin-block-start: 0;
	margin-block-end: 0;

	li {
		list-style-type: none;
	}

	.proposals__item {
		margin: 0 0 1rem 0;
		a:hover {
			text-decoration: none;
		}
	}

	.member_card {
		padding: 2rem 3rem 1.5rem 3rem;
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		transition: box-shadow .1s ease-in-out;

		&.self {
			border-left-width: 4px;
			border-left-style: solid;
			border-left-color: pink_primary;
			padding: calc(2rem - 4px);
		}

		&:hover {
			box-shadow: box_shadow_card_hover;
			text-decoration: none;
		}

		overflow-wrap: break-word;

		.ui.horizontal.segments {
			box-shadow: none;
			border: none;
			margin: 0.5rem 0;
			background-color: rgba(0,0,0,0);
		}
		.ui.segment {
			padding: 0;
		}
		.ui.horizontal.segments>.segment {
			border-left: none;
		}

		.index {
			min-width: 4rem!important;
			max-width: 6rem;
		}

		.statusTag{
			position: absolute;
			top: 0;
			right: 0;
		}


		h4, h5 {
			font-family: font_default;
			display: block;
			margin-bottom: 0.6rem;
		}

		h4 {
			font-size: lg;
			display: inline-flex;
			margin-right: 0.6rem;
			line-height: 1.2;
		}


		h5 {
			font-size: md;
			line-height: 1.4;
		}

		ul {
			color: grey_secondary;
			font-size: xs;
			font-weight: 500;
			margin-top: 0.8rem;
			li {
				display: inline;
				margin-right: 1.5rem;
			}
		}

		@media only screen and (max-width: 576px) {
			& {
				padding: 1.2rem 1.5rem;
			}

			h4 {
				font-size: md;
			}

			h4.tipTitle {
				max-width: 100%;
			}

			h5 {
				font-size: sm;
				line-height: 1.2;
			}

			.statusTag {
				padding: 0.2rem 0.4rem !important;
				font-size: 1rem!important;
			}

			.title-wrapper {
				max-width: calc(100% - 9rem);
			}
		}
	}
`;
