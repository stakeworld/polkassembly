// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import Loader from 'src/ui-components/Loader';

import DiscussionsBoard from './DiscussionsBoard';
import PostSidebar from './PostSidebar';
import ReferendaBoard from './ReferendaBoard';
import TipsBoard from './TipsBoard';

enum SidebarReducerAction {
	CLOSE,
	OPEN_DISCUSSION,
	OPEN_TIP,
	OPEN_REFERENDA
}

const initSidebarState = {
	enabled: false,
	postID: '',
	postType: ''
};

function reducer(state: any, action: any) {
	switch (action.type) {
	case SidebarReducerAction.OPEN_DISCUSSION:
		return {
			...state,
			enabled: true,
			postID: action.postID,
			postType: 'discussion'
		};

	case SidebarReducerAction.OPEN_TIP:
		return {
			...state,
			enabled: true,
			postID: action.postID,
			postType: 'tip'
		};

	case SidebarReducerAction.OPEN_REFERENDA:
		return {
			...state,
			enabled: true,
			postID: action.postID,
			postType: 'referenda'
		};

	default:
		return initSidebarState;
	}
}

const CouncilBoardContainer = ({ className } : {className?: string}) => {
	// calculate #route-wrapper height with margin for sidebar.
	const routeWrapperEl = document.getElementById('route-wrapper');
	let routeWrapperHeight = routeWrapperEl?.offsetHeight;
	if(routeWrapperEl && routeWrapperHeight) {
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-top'));
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-bottom'));
	}

	const [members, setMembers] = useState<string[]>([]);
	const [sidebarState, dispatch] = useReducer(reducer, initSidebarState);

	// const defaultAddress = 'E35K8FV3K1vn1wJfkjUZcDnG8mmcXVre4LiDZxKWDdjtaVE';
	const { defaultAddress } = useContext(UserDetailsContext);
	const { api, apiReady } = useContext(ApiContext);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.query.council.members().then((memberAccounts) => {
			setMembers(memberAccounts.map(member => member.toString()));
		});

	}, [api, apiReady]);

	const openSidebar = (postID: number, type: SidebarReducerAction) => {
		dispatch({ postID, type });
	};

	const closeSidebar = () => {
		dispatch({ type: SidebarReducerAction.CLOSE });
	};

	if (!defaultAddress) return (
		<div className={className}>
			<h5>Please login to access the council board.</h5>
		</div>
	);

	return (
		members && members.length > 0 ?
			members.includes(defaultAddress) ?
				<div className={className}>
					<h1>Council Board</h1>

					<Grid>
						<Grid.Row columns={1} only='mobile tablet'>
							<Grid.Column>
								<h3>Feature available in desktop site only.</h3>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={3} only='computer'>
							<Grid.Column>
								<DiscussionsBoard className="board-card" openSidebar={(postID) => openSidebar(postID, SidebarReducerAction.OPEN_DISCUSSION)}  />
							</Grid.Column>
							<Grid.Column>
								<ReferendaBoard className="board-card" openSidebar={(postID) => openSidebar(postID, SidebarReducerAction.OPEN_REFERENDA)}  />
							</Grid.Column>
							<Grid.Column>
								<TipsBoard className="board-card" openSidebar={(postID) => openSidebar(postID, SidebarReducerAction.OPEN_TIP)}  />
							</Grid.Column>
						</Grid.Row>
					</Grid>

					{/* Create Event Sidebar */}
					{routeWrapperHeight && sidebarState.enabled &&
				<PostSidebar
					closeSidebar={closeSidebar}
					routeWrapperHeight={routeWrapperHeight}
					sidebarState={sidebarState}
				/>
					}
				</div> :
				<div className={className}>
					<h5>Feature only available for council members.</h5>
				</div>
			:
			<div className={className}>
				<Loader />
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

	.board-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 22px;
		gap: 24px;
		background: #dddddd;
		border-radius: 16px;

		&>h3 {
			width: 100%;
			text-align: start;
			color: #5A5A5A;
			font-weight: 500;
			display: flex;
			justify-content: space-between;
		}

		.post-card-div {
			cursor: pointer;
			width: 100%
		}
	}
`;
