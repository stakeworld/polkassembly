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
	comments?: string
	created_at?: Date
	end?: number
	method?: string
	onchainId?: string | number | null
	status?: string | null
	tipReason?: string
	title?: string | null
	postType: string
}

const LatestActivityTableRow = function ({
	postId,
	address,
	className,
	// comments,
	// end = 0,
	created_at,
	method,
	onchainId,
	status,
	tipReason,
	title,
	postType
}:LatestActivityTableRowProps) {
	const { history } = useRouter();
	const [postTypeIcon, setPostTypeIcon] = useState<any>();

	useEffect(() => {
		let icon;

		switch (postType){
		case 'referenda':
			icon = <Icon name='clipboard check' />;
			break;
		case 'proposals':
			icon = <Icon name='file alternate' />;
			break;
		case 'motions':
			icon = <Icon name='forward' />;
			break;
		case 'treasury proposals':
			icon = <Icon name='diamond' />;
			break;
		case 'bounties':
			icon = <Icon name='dollar sign' />;
			break;
		case 'tips':
			icon = <Icon name='lightbulb' />;
			break;
		}

		setPostTypeIcon(icon);
	},[postType]);

	const mainTitle = <h4 className={tipReason ? 'tipTitle' : ''}><div>{method || tipReason ||  title || noTitle}</div></h4>;
	const subTitle = title && tipReason && method && <h5>{title}</h5>;
	// const currentBlock = useCurrentBlock()?.toNumber() || 0;

	const relativeCreatedAt = created_at ? moment(created_at).startOf('day').fromNow() : null;

	const gotoPost = () => {
		let path: string = '';

		switch (postType){
		case 'referenda':
			path = 'referendum';
			break;
		case 'proposals':
			path = 'proposal';
			break;
		case 'motions':
			path = 'motion';
			break;
		case 'treasury proposals':
			path = 'treasury';
			break;
		case 'bounties':
			path = 'bounty';
			break;
		case 'tips':
			path = 'tip';
			break;
		}

		history.push(`/${path}/${onchainId}`);
	};

	return (
		<Table.Row className={className + ' table-row'}>
			<Table.Cell onClick={ gotoPost }>
				<div className='main-title-text'>{mainTitle}</div>
				{subTitle && <div className='sub-title-text'>{subTitle}</div>}
			</Table.Cell>
			<Table.Cell onClick={ gotoPost }>
				<Address
					address={address}
					className='address'
					displayInline={true}
					disableIdenticon={true}
				/>
				<div className='sub-title-text'>
					Posted { relativeCreatedAt }
				</div>
			</Table.Cell>
			<Table.Cell className='postType-cell' onClick={ gotoPost }> {postTypeIcon} { postType }</Table.Cell>
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

	.main-title-text h4 {
		color: #75767C !important;
		font-size: 16px;
		font-weight: 500;
	}

	.sub-title-text {
		font-size: 14px;
		margin-top: 0.5em;
		color: #A4A4A4;
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
	}
`;
