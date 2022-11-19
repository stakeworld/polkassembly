// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import AboutTrackCard from 'src/components/Listing/Tracks/AboutTrackCard';
import TrackListingCard from 'src/components/Listing/Tracks/TrackListingCard';

const TrackListing = ({ trackName } : { trackName: string }) => {

	return (
		<>
			<AboutTrackCard trackName={trackName} />
			<TrackListingCard className='mt-12' trackName={trackName} />
		</>
	);
};

export default TrackListing;