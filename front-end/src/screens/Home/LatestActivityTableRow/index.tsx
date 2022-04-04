// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import LatestActivityPostReactions from 'src/components/Reactionbar/LatestActivityPostReactions';
// import BlockCountdown from 'src/components/BlockCountdown';
import { noTitle } from 'src/global/noTitle';

import { useRouter } from '../../../hooks';
// import useCurrentBlock from 'src/hooks/useCurrentBlock';
import Address from '../../../ui-components/Address';
import StatusTag from '../../../ui-components/StatusTag';

interface LatestActivityTableRowProps {
	postId: number
	address: string
	className?: string
	created_at?: Date
	method?: string
	onchainId?: string | number | null
	status?: string | null
	tipReason?: string
	title?: string | null
	postType: 'discussion' | 'referenda' | 'proposal' | 'motion' | 'treasury proposal' | 'tech committee proposal' | 'bounty' | 'tip'
	username?: string | null
	hideSerialNum?: boolean
}

const LatestActivityTableRow = function ({
	postId,
	address,
	className,
	created_at,
	method,
	onchainId,
	status,
	tipReason,
	title,
	postType,
	username,
	hideSerialNum
}:LatestActivityTableRowProps) {
	const { history } = useRouter();
	const [postTypeIcon, setPostTypeIcon] = useState<any>();
	const [postSerialID, setPostSerialID] = useState<any>();

	useEffect(() => {
		let icon;
		let serialID:any = 0;

		switch (postType){
		case 'discussion':
			icon = <Icon name='comments outline' />;
			serialID = null;
			break;
		case 'referenda':
			icon = <Icon name='clipboard check' />;
			serialID = onchainId;
			break;
		case 'proposal':
			icon = <Icon name='file alternate' />;
			serialID = onchainId;
			break;
		case 'motion':
			icon = <Icon name='forward' />;
			serialID = onchainId;
			break;
		case 'treasury proposal':
			icon = <Icon name='diamond' />;
			serialID = onchainId;
			break;
		case 'tech committee proposal':
			icon = <Icon name='file alternate' />;
			serialID = onchainId;
			break;
		case 'bounty':
			icon = <Icon name='dollar sign' />;
			serialID = onchainId;
			break;
		case 'tip':
			icon = <Icon name='lightbulb' />;
			serialID = null;
			break;
		}

		setPostTypeIcon(icon);
		setPostSerialID(serialID);
	},[postType, onchainId]);

	const mainTitle = title || method || noTitle;

	// truncate mainTitle
	const trimmedMainTitle = mainTitle.length > 80 ? `${mainTitle.substring(0, Math.min(80, mainTitle.length))}...`  : mainTitle.substring(0, Math.min(80, mainTitle.length));

	const subTitle = title && tipReason && method && <h5>{title}</h5>;
	// const currentBlock = useCurrentBlock()?.toNumber() || 0;

	const relativeCreatedAt = created_at ? moment(created_at).startOf('day').fromNow() : null;

	const gotoPost = () => {
		let path: string = '';

		switch (postType){
		case 'discussion':
			path = 'post';
			break;
		case 'referenda':
			path = 'referendum';
			break;
		case 'proposal':
			path = 'proposal';
			break;
		case 'motion':
			path = 'motion';
			break;
		case 'treasury proposal':
			path = 'treasury';
			break;
		case 'tech committee proposal':
			path = 'tech';
			break;
		case 'bounty':
			path = 'bounty';
			break;
		case 'tip':
			path = 'tip';
			break;
		}

		history.push(`/${path}/${onchainId}`);
	};

	return (
		<Table.Row className={className + ' table-row'}>
			{!hideSerialNum ? <Table.Cell onClick={ gotoPost } className='sub-title-text serial-num'>
				{ postSerialID }
			</Table.Cell> : null}
			<Table.Cell className='main-title' onClick={ gotoPost }>
				<div className='main-title-text'>
					<h4>
						<div>
							{trimmedMainTitle}
						</div>
					</h4>
				</div>
				{subTitle && <div className='sub-title-text'>{subTitle}</div>}
			</Table.Cell>
			<Table.Cell onClick={ gotoPost }>
				{!address ? <span className='username'> { username } </span> :
					<Address
						address={address}
						className='address'
						displayInline={true}
						disableIdenticon={true}
					/>
				}
				<div className='sub-title-text'>
					Posted { relativeCreatedAt }
				</div>
			</Table.Cell>
			<Table.Cell className='postType-cell' onClick={ gotoPost }> {postTypeIcon} { postType == 'tech committee proposal' ? 'Proposal': postType }</Table.Cell>
			<Table.Cell onClick={ gotoPost }>{status && <StatusTag className='statusTag' status={status} />}</Table.Cell>
			<Table.Cell className='action-btn-cell'>
				<LatestActivityPostReactions className='reactions' gotoPost={gotoPost} postId={postId} />
			</Table.Cell>
		</Table.Row>
	);
};

export default styled(LatestActivityTableRow)`
	cursor: pointer !important;
	
	td {
		padding-top: 0.5em !important;
		padding-bottom: 0.5em !important;
	}

	.serial-num {
		padding-right: 0 !important;
	}

	@media only screen and (min-width: 992px) {
		.main-title {
			padding-left: 0 !important;
		}
	}

	.main-title-text h4 {
		color: #75767C !important;
		font-size: 16px;
		font-weight: 400;
	}

	.sub-title-text {
		font-size: 14px;
		margin-top: 0.5em;
		color: #A4A4A4;
	}

	.username {
		color: #75767C !important;
		font-weight: 400;
		font-size: 16px !important;
	}

	.address{
		.identityName{
			font-size: 16px !important;
		}
	}

	.action-btn-cell {
		display: flex;
		cursor: default !important;
		padding-top: 0.9em !important;
	}

	.action-btn {
		background: transparent;
	}

	.postType-cell {
		text-transform: capitalize;
		color: #75767C;
		font-size: 16px !important;
	}

	.statusTag {
		font-size: 16px !important;
		font-weight: 400 !important;
	}
`;
