// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';

import FellowshipMemberCard from './FellowshipMemberCard';
import { FellowshipMember } from './FellowshipMembersContainer';

interface Props {
  className?: string
  data: FellowshipMember[]
}

const FellowshipMembersListing = ({ className, data } : Props) => {

	return (
		<div className={`${className} motions__list`}>
			{data.map(
				(member) => (
					<div key={member.accountId} className='my-5'>
						{<Link to={`/profile/${member.accountId}?fellowship=true`}>
							<FellowshipMemberCard member={member} />
						</Link>}
					</div>
				)
			)}
		</div>
	);
};

export default FellowshipMembersListing;