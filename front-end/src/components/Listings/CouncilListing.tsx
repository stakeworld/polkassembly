// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';

import NothingFoundCard from '../../ui-components/NothingFoundCard';
import MembersRunnerUps from './MembersRunnerUps';

interface Props {
  className?: string
  members: string[]
  prime: string
  runnersUp?: string[]
}

const CouncilMembers = ({ className, members, prime, runnersUp }: Props) => {

	return (
		<div>
			<div>
				{members.length ?
					<MembersRunnerUps className={className} data={members} prime={prime}/>
					:
					<NothingFoundCard className={className} text='There are currently no elected council members.'/>}
			</div>
			<div className='runnersUp'>
				<h1> Runners Up </h1>
				{runnersUp && runnersUp?.length ?
					<MembersRunnerUps className={className} data={runnersUp} prime={prime}/>
					:
					<NothingFoundCard className={className} text='There is currently no runner up.'/>}
			</div>
		</div>

	);
};

export default styled(CouncilMembers)`
	margin-block-start: 0;
	margin-block-end: 0;

	.runnersUp {
		margin-top: 4rem
	}
`;
