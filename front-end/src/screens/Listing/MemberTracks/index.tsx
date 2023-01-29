// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import AboutTrackCard from 'src/components/Listing/Tracks/AboutTrackCard';
import TrackListingCard from 'src/components/Listing/Tracks/TrackListingCard';

const TrackListing = ({ trackName, isMemberReferenda } : { trackName: string, isMemberReferenda?: boolean }) => {
	return (
		<>
			<AboutTrackCard trackName={trackName} isMemberReferenda = {isMemberReferenda}/>
			<TrackListingCard className='mt-12' trackName={trackName} isMemberReferenda = {isMemberReferenda}/>
		</>
	);
};

export default TrackListing;