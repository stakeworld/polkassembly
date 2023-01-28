// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { Tabs } from 'antd';
import React from 'react';

import FellowshipListingAllTabContent from '../Fellowships/FellowshipListingAllTabContent';
import FellowshipListingStatusTabContent from '../Fellowships/FellowshipListingStatusTabContent';
import TrackListingAllTabContent from './TrackListingAllTabContent';
import TrackListingStatusTabContent from './TrackListingStatusTabContent';

interface Props {
	className?: string;
	trackName: string;
	isMemberReferenda?: boolean;
	setMemberType: React.Dispatch<React.SetStateAction<string>>
}

const TrackListingCard = ({ className, trackName, isMemberReferenda, setMemberType } : Props) => {
	const handleTabChange = (key: string) => {
		setMemberType(key);
	};

	const items = [
		{ label: 'All', key: 'All', children: <TrackListingAllTabContent trackName={trackName} /> },
		{ label: 'Confirmed', key: 'Confirmed', children: <TrackListingStatusTabContent trackName={trackName} status='Confirmed' /> },
		{ label: 'Cancelled', key: 'Cancelled', children: <TrackListingStatusTabContent trackName={trackName} status='Cancelled' /> },
		{ label: 'Deciding', key: 'Deciding', children: <TrackListingStatusTabContent trackName={trackName} status='Deciding' /> },
		{ label: 'Killed', key: 'Killed', children: <TrackListingStatusTabContent trackName={trackName} status='Killed' /> },
		{ label: 'Submitted', key: 'Submitted', children: <TrackListingStatusTabContent trackName={trackName} status='Submitted' /> },
		{ label: 'Rejected', key: 'Rejected', children: <TrackListingStatusTabContent trackName={trackName} status='Rejected' /> },
		{ label: 'Timed Out', key: 'Timedout', children: <TrackListingStatusTabContent trackName={trackName} status='Timedout' /> }
	];

	const memberReferendaItems = [
		{ label: 'All', key: 'All', children: <FellowshipListingAllTabContent trackName={trackName} /> },
		{ label: 'Candidates', key: 'Candidates', children: <FellowshipListingStatusTabContent trackName={trackName} status='Candidates' /> },
		{ label: 'Members', key: 'Members', children: <FellowshipListingStatusTabContent trackName={trackName} status='Members' /> },
		{ label: 'Proficients', key: 'Proficients', children: <FellowshipListingStatusTabContent trackName={trackName} status='Proficients' /> },
		{ label: 'Fellows', key: 'Fellows', children: <FellowshipListingStatusTabContent trackName={trackName} status = 'Fellows'/> },
		{ label: 'Experts', key: 'Experts', children: <TrackListingAllTabContent trackName={trackName} /> },
		{ label: 'Senior Experts', key: 'Senior Experts', children: <FellowshipListingStatusTabContent trackName={trackName} status='Senior Experts'/> },
		{ label: 'Masters', key: 'Masters', children: <FellowshipListingStatusTabContent trackName={trackName} status='Masters' /> },
		{ label: 'Senior Masters', key: 'Senior Masters', children: <FellowshipListingStatusTabContent trackName={trackName} status='Senior Masters'/> },
		{ label: 'Grand Masters', key: 'Grand Masters', children: <FellowshipListingStatusTabContent trackName={trackName} status='Grand Masters'/> }
	];

	return (
		<div className={`${className} bg-white drop-shadow-md rounded-md p-4 md:p-8 text-sidebarBlue`}>
			<h2 className="text-lg capitalize font-medium mb-10">Referenda</h2>

			<Tabs
				onChange={handleTabChange}
				items={isMemberReferenda? memberReferendaItems : items}
				type="card"
				className='ant-tabs-tab-bg-white text-sidebarBlue font-medium'
			/>
		</div>
	);
};

export default TrackListingCard;