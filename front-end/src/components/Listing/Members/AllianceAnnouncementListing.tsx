// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { PostEmptyState } from 'src/ui-components/UIStates';

interface Props {
  className?: string
  data: string[]
}

const AllianceAnnouncementsListing = ({ className, data } : Props) => {

	if (!data.length) return <div className={className}><PostEmptyState /></div>;

	return (
		<div className={`${className} motions__list`}>
			{data.map(
				(member) => (
					<div key={member} className='my-5'>
						<div className={`${className} border-2 border-grey_light rounded-md p-3 md:p-4`}>
							<div className="content">
								{data}
							</div>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default AllianceAnnouncementsListing;