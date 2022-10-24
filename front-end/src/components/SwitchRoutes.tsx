// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Bounties from 'src/screens/Bounties';
import PostBounty from 'src/screens/BountyPost';
import CalendarView from 'src/screens/CalendarView';
import ChildBounties from 'src/screens/ChildBounties';
import ChildPostBounty from 'src/screens/ChildBountyPost';
import Council from 'src/screens/Council';
import CouncilBoard from 'src/screens/CouncilBoard';
import CreatePost from 'src/screens/CreatePost';
import PostDiscussion from 'src/screens/DiscussionPost';
import Discussions from 'src/screens/Discussions';
import Home from 'src/screens/Home';
import { PrivacyPolicy, TermsAndConditions, TermsOfWebsite } from 'src/screens/LegalDocuments';
import LoginForm from 'src/screens/LoginForm';
import PostMotion from 'src/screens/MotionPost';
import Motions from 'src/screens/Motions';
import NewsView from 'src/screens/NewsView';
import NotFound from 'src/screens/NotFound';
import NotificationSettings from 'src/screens/NotificationSettings';
import OnChain from 'src/screens/OnChain';
import Profile from 'src/screens/Profile';
import PostProposal from 'src/screens/ProposalPost';
import Proposals from 'src/screens/Proposals';
import Referenda from 'src/screens/Referenda';
import PostReferendum from 'src/screens/ReferendumPost';
import RequestResetPassword from 'src/screens/RequestResetPassword';
import ResetPassword from 'src/screens/ResetPassword';
import Search from 'src/screens/Search';
import Settings from 'src/screens/Settings';
import SignupForm from 'src/screens/SignupForm';
import PostTechCommitteeProposal from 'src/screens/TechCommitteeProposalPost';
import TechCommitteeProposals from 'src/screens/TechCommitteeProposals';
import PostTip from 'src/screens/TipPost';
import Tips from 'src/screens/Tips';
import Tracker from 'src/screens/Tracker';
import Treasury from 'src/screens/Treasury';
import PostTreasury from 'src/screens/TreasuryPost';
import UndoEmailChange from 'src/screens/UndoEmailChange';
import UserProfile from 'src/screens/UserProfile';
import VerifyEmail from 'src/screens/VerifyEmail';

function SwitchRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home/>} />

			<Route path="/discussions" element={<Discussions/>} />

			<Route path="/login" element={<LoginForm/>} />

			<Route path="/post/create" element={<CreatePost/>} />

			<Route path="/bounty/:id" element={<PostBounty/>} />

			<Route path="/child_bounty/:id" element={<ChildPostBounty/>} />

			<Route path="/motion/:id" element={<PostMotion/>} />

			<Route path="/proposal/:id" element={<PostProposal/>} />

			<Route path="/referendum/:id" element={<PostReferendum/>} />

			<Route path="/treasury/:id" element={<PostTreasury/>} />

			<Route path="/tech/:id" element={<PostTechCommitteeProposal/>} />

			<Route path="/tip/:hash" element={<PostTip/>} />

			<Route path="/post/:id" element={<PostDiscussion/>} />

			<Route path="/onchain" element={<OnChain/>} />

			<Route path="/bounties" element={<Bounties/>} />

			<Route path="/child_bounties" element={<ChildBounties/>} />

			<Route path="/referenda" element={<Referenda/>} />

			<Route path="/proposals" element={<Proposals/>} />

			<Route path="/motions" element={<Motions/>} />

			<Route path="/treasury-proposals" element={<Treasury/>} />

			<Route path="/tech-comm-proposals" element={<TechCommitteeProposals/>} />

			<Route path="/tips" element={<Tips/>} />

			<Route path="/request-reset-password" element={<RequestResetPassword/>} />

			<Route path="/reset-password" element={<ResetPassword/>} />

			<Route path="/signup" element={<SignupForm/>} />

			<Route path="/verify-email/:token" element={<VerifyEmail/>} />

			<Route path="/undo-email-change/:token" element={<UndoEmailChange/>} />

			<Route path="/settings" element={<Settings/>} />

			<Route path="/notification-settings" element={<NotificationSettings/>} />

			<Route path="/terms-and-conditions" element={<TermsAndConditions/>} />

			<Route path="/terms-of-website" element={<TermsOfWebsite/>} />

			<Route path="/privacy" element={<PrivacyPolicy/>} />

			<Route path="/user/:username" element={<UserProfile />} />

			<Route path="/search" element={<Search/>} />

			<Route path="/tracker" element={<Tracker/>} />

			<Route path="/council" element={<Council/>} />

			<Route path="/council-board" element={<CouncilBoard/>} />

			<Route path="/profile/:address" element={<Profile/>} />

			<Route path="/calendar" element={<CalendarView/>} />

			<Route path="/news" element={<NewsView/>} />

			<Route path="*" element={<NotFound/>} />

		</Routes>
	);
}

export default SwitchRoutes;

