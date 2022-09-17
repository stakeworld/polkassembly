// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import PostDiscussion from 'src/screens/DiscussionPost';

interface Props {
  className?: string
	routeWrapperHeight: number
	closeSidebar: () => void
	sidebarState: any
}

const PostSidebar = ({ className, routeWrapperHeight, closeSidebar, sidebarState }: Props) => {
	return (
		<div className={className} style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>
			<Icon className='close-sidebar-icon' onClick={closeSidebar} name='close' />
			<div className="sidebar-content">
				{sidebarState.postType === 'discussion' &&
					<PostDiscussion postID={sidebarState.postID} />
				}
			</div>
		</div>
	);
};

export default styled(PostSidebar)`
	position: absolute;
	min-width: 250px;
	width: max-content;
	max-width: 70vw;
	right: 0;
	top: 6.5rem;
	background: #fff;
	z-index: 100;
	padding: 40px 24px;
	box-shadow: -5px 0 15px -12px #888;

	@media only screen and (max-width: 768px) {
		max-width: 90vw;
		top: 0;
		padding: 40px 14px;
		padding-top: 70px;
		overflow-y: auto;

		h1 {
			margin-top: 0;
		}

		.sidebar-event-content {
			padding-right: 10px;
		}
	}

	.close-sidebar-icon {
		cursor: pointer;
		position: absolute;
		right: 10px;
		top: 20px;
	}

	.sidebar-content {
		margin-top: 20px;
	}
`;
