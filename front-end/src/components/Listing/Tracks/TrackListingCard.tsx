// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { Tabs } from 'antd';
import React from 'react';
import { trackInfo } from 'src/global/post_trackInfo';

import TrackListingAllTabContent from './TrackListingAllTabContent';
import TrackListingStatusTabContent from './TrackListingStatusTabContent';

interface Props {
	className?: string;
	trackName: string;
}

const TrackListingCard = ({ className, trackName } : Props) => {
	const trackMetaData = trackInfo[trackName];

	const items = [
		{ label: 'All', key: 'All', children: <TrackListingAllTabContent trackNum={trackMetaData.trackId} /> },
		{ label: 'Approved', key: 'Approved', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Approved' /> },
		{ label: 'Cancelled', key: 'Cancelled', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Cancelled' /> },
		{ label: 'Killed', key: 'Killed', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Killed' /> },
		{ label: 'Ongoing', key: 'Ongoing', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Ongoing' /> },
		{ label: 'Rejected', key: 'Rejected', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Rejected' /> },
		{ label: 'Timedout', key: 'Timedout', children: <TrackListingStatusTabContent trackNum={trackMetaData.trackId} status='Timedout' /> }
	];

	return (
		<div className={`${className} bg-white drop-shadow-md rounded-md p-4 md:p-8 text-sidebarBlue`}>
			<h2 className="text-lg capitalize font-medium mb-10">Referenda</h2>

			<Tabs
				items={items}
				type="card"
				className='ant-tabs-tab-bg-white text-sidebarBlue font-medium'
			/>
		</div>
	);
};

export default TrackListingCard;