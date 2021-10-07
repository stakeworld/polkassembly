// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import NothingFoundCard from 'src/ui-components/NothingFoundCard';

import GovernanceCard from '../GovernanceCard';

interface Props {
  className?: string
  members: string[]
}

const CouncilMembers = ({ className, members }: Props) => {

	if (!members.length) return <NothingFoundCard className={className} text='There are currently no elected council members.'/>;

	return (
		<ul className={`${className} proposals__list`}>
			{members.map(
				(member) => {

					return (
						<li key={member} className='proposals__item'>
							{<Link to={`/address/${member}`}>
								<GovernanceCard
									address={member}
									comments={'no'}
									onchainId={1}
									status={'Elected'}
									title={'Council Member'}
									topic={'member'}
								/>
							</Link>}
						</li>
					);
				}
			)}
		</ul>
	);
};

export default styled(CouncilMembers)`
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
`;
