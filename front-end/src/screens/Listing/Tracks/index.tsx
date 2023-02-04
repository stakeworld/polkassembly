// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import AboutTrackCard from 'src/components/Listing/Tracks/AboutTrackCard';
import TrackListingCard from 'src/components/Listing/Tracks/TrackListingCard';

const TrackListing = ({ trackName, isMemberReferenda } : { trackName?: string, isMemberReferenda?: boolean }) => {
	return (
		<>
			{isMemberReferenda && <div className={'bg-white drop-shadow-md rounded-md p-4 md:p-8 text-sidebarBlue'}>
				<h2 className="text-lg capitalize">Member Referenda</h2>
				<p className="mt-5 text-sm font-normal">Aggregation of data across all membership referenda</p>
			</div>}
			{trackName && <AboutTrackCard trackName={trackName} isMemberReferenda={isMemberReferenda} />}
			<TrackListingCard className='mt-12' trackName={trackName} isMemberReferenda={isMemberReferenda}/>
		</>
	);
};

export default TrackListing;