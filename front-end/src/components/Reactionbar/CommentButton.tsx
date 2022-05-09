// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';

import commentImg from '../../assets/latest-activity-comment.png';
import Button from '../../ui-components/Button';

export interface CommentButtonProps {
	className?: string
	postId?: number
	gotoPost: () => void
	reactionsDisabled: boolean
}

const CommentButton = function ({
	className,
	gotoPost,
	reactionsDisabled
}: CommentButtonProps) {
	const { id } = useContext(UserDetailsContext);

	const button =  <span className={className}>
		{
			<Button
				className='social'
				onClick={gotoPost}
				disabled={!id || reactionsDisabled}
			>
				<img width='20px' height='20px' src={commentImg} alt="Comment" />
			</Button>
		}

	</span>;

	return button;
};

export default styled(CommentButton)`
	.social {
		color: blue_primary !important;
		font-size: 1em !important;

		:not(.reacted) {
			background-color: transparent !important;
		}
	}

	.social:hover, .reacted {
		background-color: blue_secondary !important;
		border: none !important;
	}
`;
