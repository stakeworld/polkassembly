// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';

import TipsPostCard from './TipsPostCard';

interface Props {
	className?: string
	openSidebar: (postID: number) => void
}

const TipsBoard = ({ className, openSidebar } : Props) => {
	return (
		<div className={className}>
			<h3>Tips <span className='card-count'>23</span></h3>

			{[1,2,3,4].map(item => (
				<div key={item} className='post-card-div' onClick={() => openSidebar(item)}>
					<TipsPostCard />
				</div>
			))}
		</div>
	);
};

export default styled(TipsBoard)``;