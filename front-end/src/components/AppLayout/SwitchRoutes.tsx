// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { trackInfo } from 'src/global/post_trackInfo';
import CalendarView from 'src/screens/CalendarView';
import CouncilBoard from 'src/screens/CouncilBoard';
import CreatePost from 'src/screens/CreatePost';
import Gov2Home from 'src/screens/Gov2Home';
import Home from 'src/screens/Home';
import { PrivacyPolicy, TermsAndConditions, TermsOfWebsite } from 'src/screens/LegalDocuments';
import Bounties from 'src/screens/Listing/Bounties';
import ChildBounties from 'src/screens/Listing/ChildBounties';
import Discussions from 'src/screens/Listing/Discussions';
import FellowshipMembers from 'src/screens/Listing/FellowshipMembers';
import Members from 'src/screens/Listing/Members';
import Motions from 'src/screens/Listing/Motions';
import Parachains from 'src/screens/Listing/Parachains';
import Proposals from 'src/screens/Listing/Proposals';
import Referenda from 'src/screens/Listing/Referenda';
import TechCommProposals from 'src/screens/Listing/TechCommProposals';
import Tips from 'src/screens/Listing/Tips';
import TrackListing from 'src/screens/Listing/Tracks';
import Treasury from 'src/screens/Listing/Treasury';
import LoginForm from 'src/screens/LoginForm';
import News from 'src/screens/News';
import NotFound from 'src/screens/NotFound';
import NotificationSettings from 'src/screens/NotificationSettings';
import BountyPost from 'src/screens/Posts/BountyPost';
import ChildBountyPost from 'src/screens/Posts/ChildBountyPost';
import DiscussionPost from 'src/screens/Posts/DiscussionPost';
import MemberReferendumPost from 'src/screens/Posts/MemberReferenumPost';
import MotionPost from 'src/screens/Posts/MotionPost';
import ProposalPost from 'src/screens/Posts/ProposalPost';
import ReferendumPost from 'src/screens/Posts/ReferendumPost';
import ReferendumV2Post from 'src/screens/Posts/ReferendumV2Post';
import TechCommProposalPost from 'src/screens/Posts/TechCommProposalPost';
import TipPost from 'src/screens/Posts/TipPost';
import TreasuryPost from 'src/screens/Posts/TreasuryPost';
import PreImages from 'src/screens/PreImages';
import Profile from 'src/screens/Profile';
import RequestResetPassword from 'src/screens/RequestResetPassword';
import ResetPassword from 'src/screens/ResetPassword';
import Settings from 'src/screens/Settings';
import SignupForm from 'src/screens/SignupForm';
import Tracker from 'src/screens/Tracker';
import UndoEmailChange from 'src/screens/UndoEmailChange';
import UserProfile from 'src/screens/UserProfile';
import VerifyEmail from 'src/screens/VerifyEmail';
import { PostOrigin } from 'src/types';

export const gov2Routes = [
	'gov-2',
	'track',
	'preimages',
	'referenda',
	'fellowship',
	'member-referenda'
];

for (const trackName of Object.keys(trackInfo)) {
	gov2Routes.push(trackName.split(/(?=[A-Z])/).join('-').toLowerCase());
}

const RedirectToReferenda = () => {
	const { id } = useParams();
	return <Navigate to={`/referenda/${id}`} replace />;
};

const SwitchRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path="/request-reset-password" element={<RequestResetPassword/>}/>
			<Route path="/reset-password" element={<ResetPassword/>}/>
			<Route path="/verify-email/:token" element={<VerifyEmail/>} />
			<Route path="/undo-email-change/:token" element={<UndoEmailChange/>} />
			<Route path="/login" element={<LoginForm />}/>
			<Route path="/signup" element={<SignupForm/>} />
			<Route path="/settings" element={<Settings/>} />
			<Route path="/notification-settings" element={<NotificationSettings/>} />
			<Route path="/user/:username" element={<UserProfile/>} />
			<Route path='/discussions' element={<Discussions />} />
			<Route path='/news' element={<News />} />
			<Route path='/post'>
				<Route path=':id' element={<DiscussionPost />} />
				<Route path="create" element={<CreatePost />} />
			</Route>

			<Route path='parachains' element={<Parachains/>} />

			<Route path="/proposals" element={<Proposals />}/>
			<Route path="/proposal/:id" element={<ProposalPost />} />

			<Route path="/referenda" element={<Referenda />} />
			<Route path="/referendum/:id" element={<ReferendumPost />} />

			<Route path="/treasury-proposals" element={<Treasury />} />
			<Route path="/treasury/:id" element={<TreasuryPost />} />

			<Route path="/bounties" element={<Bounties />} />
			<Route path="/bounty/:id" element={<BountyPost />} />

			<Route path="/child_bounties" element={<ChildBounties />} />
			<Route path="/child_bounty/:id" element={<ChildBountyPost />} />

			<Route path="/tips" element={<Tips />} />
			<Route path="/tip/:hash" element={<TipPost />} />

			<Route path="/motions" element={<Motions />} />
			<Route path="/motion/:id" element={<MotionPost />} />

			<Route path="/council" element={<Members />} />

			<Route path="/council-board" element={<CouncilBoard />} />

			<Route path="/calendar" element={<CalendarView />} />

			<Route path="/profile/:address" element={<Profile />} />

			<Route path="/tracker" element={<Tracker />} />

			<Route path="/tech-comm-proposals" element={<TechCommProposals />} />
			<Route path="/tech/:id" element={<TechCommProposalPost />} />

			<Route path="/terms-and-conditions" element={<TermsAndConditions/>} />
			<Route path="/terms-of-website" element={<TermsOfWebsite/>} />
			<Route path="/privacy" element={<PrivacyPolicy/>} />

			{/* GOV 2 Routes */}
			<Route path="/gov-2" element={<Gov2Home />} />
			<Route path="/preimages" element={<PreImages />} />

			<Route path="/root" element={<TrackListing trackName={PostOrigin.ROOT} />} />
			<Route path="/auction-admin" element={<TrackListing trackName={PostOrigin.AUCTION_ADMIN} />} />
			<Route path="/staking-admin" element={<TrackListing trackName={PostOrigin.STAKING_ADMIN} />} />
			<Route path="/lease-admin" element={<TrackListing trackName={PostOrigin.LEASE_ADMIN} />} />

			<Route path="/general-admin">
				<Route index element={<TrackListing trackName={PostOrigin.GENERAL_ADMIN} />} />
				<Route path=':id' element={<RedirectToReferenda />} />
			</Route>

			<Route path="/referendum-canceller" element={<TrackListing trackName={PostOrigin.REFERENDUM_CANCELLER} />} />
			<Route path="/referendum-killer" element={<TrackListing trackName={PostOrigin.REFERENDUM_KILLER} />} />

			<Route path="/treasurer">
				<Route index element={<TrackListing trackName={PostOrigin.TREASURER} />} />
				<Route path=':id' element={<RedirectToReferenda />} />
			</Route>

			<Route path="/small-tipper" element={<TrackListing trackName={PostOrigin.SMALL_TIPPER} />} />
			<Route path="/big-tipper" element={<TrackListing trackName={PostOrigin.BIG_TIPPER} />} />
			<Route path="/small-spender" element={<TrackListing trackName={PostOrigin.SMALL_SPENDER} />} />
			<Route path="/medium-spender" element={<TrackListing trackName={PostOrigin.MEDIUM_SPENDER} />} />

			<Route path="/big-spender">
				<Route index element={<TrackListing trackName={PostOrigin.BIG_SPENDER} />} />
				<Route path=':id' element={<RedirectToReferenda />} />
			</Route>

			<Route path="/fellowship" element={<FellowshipMembers />} />
			<Route path="/whitelisted-caller" element={<TrackListing trackName={PostOrigin.WHITELISTED_CALLER} />} />
			<Route path="/fellowship-admin" element={<TrackListing trackName={PostOrigin.FELLOWSHIP_ADMIN} />} />
			<Route path="/member-referenda">
				<Route index element={<TrackListing isMemberReferenda />} />
				<Route path=':id' element={<MemberReferendumPost/> } />
			</Route>

			<Route path='/referenda/:id' element={<ReferendumV2Post />} />

			<Route path="*" element={<NotFound />} />

		</Routes>
	);
};

export default SwitchRoutes;