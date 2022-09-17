// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon } from 'semantic-ui-react';

const ReferendaPostCard = ({ className } : { className?: string }) => {
	return (
		<div className={className}>
			<div className="vote-history">
				<span>Icon</span> on 22 Jul, 3:00pm
			</div>

			<h5>Talisman Proposal: Cross-Chain Transaction</h5>
			<p>Working on finishing up the tickets for the bigger project files. Working on finishing up the tickets for</p>

			<div className="info-bar">
				<div className="referenda-post-status failing passed/passing/failed/failing">
					Failing
				</div>

				<div className="right-info d-flex">
					<div className="time">
						<Icon name='clock outline' />
						20h ago
					</div>
				</div>
			</div>
		</div>
	);
};

export default styled(ReferendaPostCard)`
	background: #FFFFFF;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.16);
	border-radius: 8px;
	padding: 15px 20px;

	h5 {
		font-size: 16px;
	}

	p {
		font-size: 14px;
		margin: 12px auto;
	}

	.vote-history {
		font-weight: 500;
		font-size: 12px;
		margin-bottom: 6px;

		&.yay {
			color: #5BC044;
		}

		&.nay {
			color: #FF0000;
		}
	}

	.info-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.referenda-post-status {
			font-size: 14px;
			padding: 4px 8px;
			background: #B6B6B6;
			border-radius: 4px;
			color: #FFFFFF;

			&.passed, &.passing {
				background: #5BC044;
			}

			&.failed, &.failing {
				background: #FF0000;
			}
		}

		.right-info {
			.time {
				margin-left: 24px;
			}
		}
	}
`;
