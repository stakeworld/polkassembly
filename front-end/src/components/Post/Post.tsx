// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { Tabs } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaContext } from 'src/context/MetaContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { BountyPostAndCommentsQueryHookResult, BountyPostFragment, ChildBountyPostAndCommentsQueryHookResult, ChildBountyPostFragment, DiscussionPostAndCommentsQueryHookResult, DiscussionPostFragment, FellowshipReferendumPostAndCommentsQueryHookResult,MotionPostAndCommentsQueryHookResult, MotionPostFragment, OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment, ProposalPostAndCommentsQueryHookResult, ProposalPostFragment, ReferendumPostAndCommentsQueryHookResult, ReferendumPostFragment, ReferendumV2PostAndCommentsQueryHookResult, TechCommitteeProposalPostAndCommentsQueryHookResult, TechCommitteeProposalPostFragment, TipPostAndCommentsQueryHookResult, TipPostFragment, TreasuryProposalPostAndCommentsQueryHookResult, TreasuryProposalPostFragment } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import { FellowshipReferendumPostFragment, OnchainLinkFellowshipReferendumFragment, OnchainLinkReferendumV2Fragment, ReferendumV2PostFragment } from 'src/types';
import { PostEmptyState } from 'src/ui-components/UIStates';

import AboutTrackCard from '../Listing/Tracks/AboutTrackCard';
import OtherProposals from '../OtherProposals';
import SidebarRight from '../SidebarRight';
import OptionPoll from './ActionsBar/OptionPoll';
import TrackerButton from './ActionsBar/TrackerButton';
import ClaimPayoutModal from './ClaimPayoutModal';
import EditablePostContent from './EditablePostContent';
import GovernanceSideBar from './GovernanceSideBar';
import Poll from './Poll';
import PostHeading from './PostHeading';
import PostDescription from './Tabs/PostDescription';
import PostOnChainInfo from './Tabs/PostOnChainInfo';
import PostTimeline from './Tabs/PostTimeline';

interface Props {
	className?: string
	data: (
		DiscussionPostAndCommentsQueryHookResult['data'] |
		ProposalPostAndCommentsQueryHookResult['data'] |
		ReferendumPostAndCommentsQueryHookResult['data'] |
		MotionPostAndCommentsQueryHookResult['data'] |
		TreasuryProposalPostAndCommentsQueryHookResult['data'] |
		TipPostAndCommentsQueryHookResult['data'] |
		BountyPostAndCommentsQueryHookResult['data'] |
		TechCommitteeProposalPostAndCommentsQueryHookResult['data'] |
		ChildBountyPostAndCommentsQueryHookResult['data'] |
		ReferendumV2PostAndCommentsQueryHookResult['data'] |
		FellowshipReferendumPostAndCommentsQueryHookResult['data']
	)
	trackName?: string
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean
	isTipProposal?: boolean
	isChildBounty?: boolean
	isReferendumV2?: boolean
	isFellowshipReferendum?: boolean
	refetch: any
}
interface Redirection {
	link?: string;
	text?: string;
}

const Post = ({
	className,
	data,
	trackName,
	isBounty = false,
	isChildBounty = false,
	isMotion = false,
	isProposal = false,
	isReferendum = false,
	isTipProposal = false,
	isTreasuryProposal = false,
	isTechCommitteeProposal = false,
	isReferendumV2 = false,
	isFellowshipReferendum = false,
	refetch }: Props ) => {

	const post = data && data.posts && data.posts[0];
	const { id, addresses } = useContext(UserDetailsContext);
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing(!isEditing);
	const { setMetaContextState } = useContext(MetaContext);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [proposerAddress, setProposerAddress] = useState<string>('');
	console.log('post data', data);
	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		const users: string[] = [];

		if (post?.author?.username) {
			users.push(post?.author?.username);
		}

		post?.comments.forEach(c => {
			if (c.author?.username && !users.includes(c.author?.username)) {
				users.push(c.author?.username);
			}
		});
		global.window.localStorage.setItem('users', users.join(','));
	}, [post]);

	useEffect(() => {
		setMetaContextState((prevState) => {
			return {
				...prevState,
				description: post?.content || prevState.description,
				title: `${post?.title || 'Polkassembly' }`
			};
		});
	}, [post, setMetaContextState]);

	const isOnchainPost = isMotion || isProposal || isReferendum || isTreasuryProposal || isBounty || isTechCommitteeProposal || isTipProposal || isReferendumV2 || isFellowshipReferendum;

	let onchainId: string | number | null | undefined;
	let referendumV2Post: ReferendumV2PostFragment | undefined;
	let fellowshipReferendumPost: FellowshipReferendumPostFragment | undefined;
	let referendumPost: ReferendumPostFragment | undefined;
	let proposalPost: ProposalPostFragment | undefined;
	let motionPost: MotionPostFragment | undefined;
	let treasuryPost: TreasuryProposalPostFragment | undefined;
	let tipPost: TipPostFragment | undefined;
	let bountyPost: BountyPostFragment | undefined;
	let childBountyPost: ChildBountyPostFragment | undefined;
	let techCommitteeProposalPost: TechCommitteeProposalPostFragment | undefined;
	let definedOnchainLink: OnchainLinkReferendumV2Fragment | OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkReferendumFragment | OnchainLinkProposalFragment | OnchainLinkTipFragment | OnchainLinkTreasuryProposalFragment | undefined | OnchainLinkFellowshipReferendumFragment;
	let postStatus: string | undefined;
	let redirection: Redirection = {};

	if (post && isTechCommitteeProposal) {
		techCommitteeProposalPost = post as TechCommitteeProposalPostFragment;
		definedOnchainLink = techCommitteeProposalPost.onchain_link as OnchainLinkTechCommitteeProposalFragment;
		onchainId = definedOnchainLink.onchain_tech_committee_proposal_id;
		postStatus = techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.[0].status;
	}

	if (post && isBounty) {
		bountyPost = post as BountyPostFragment;
		definedOnchainLink = bountyPost.onchain_link as OnchainLinkBountyFragment;
		onchainId = definedOnchainLink.onchain_bounty_id;
		postStatus = bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.[0].status;
	}

	if (post && isChildBounty) {
		childBountyPost = post as ChildBountyPostFragment;
		definedOnchainLink = childBountyPost.onchain_link as OnchainLinkChildBountyFragment;
		onchainId = definedOnchainLink.onchain_child_bounty_id;
		postStatus = childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.[0].status;
	}

	if (post && isReferendum) {
		referendumPost = post as ReferendumPostFragment;
		definedOnchainLink = referendumPost.onchain_link as OnchainLinkReferendumFragment;
		onchainId = definedOnchainLink.onchain_referendum_id;
		postStatus = referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.[0].status;
	}

	if (post && isReferendumV2) {
		referendumV2Post = post as ReferendumV2PostFragment;
		definedOnchainLink = referendumV2Post.onchain_link as OnchainLinkReferendumV2Fragment;
		onchainId = definedOnchainLink.onchain_referendumv2[0]?.referendumId;
		postStatus = referendumV2Post?.onchain_link?.onchain_referendumv2?.[0]?.referendumStatus?.[0].status;
	}

	if (post && isFellowshipReferendum) {
		fellowshipReferendumPost = post as FellowshipReferendumPostFragment;
		definedOnchainLink = fellowshipReferendumPost.onchain_link as OnchainLinkFellowshipReferendumFragment;
		onchainId = definedOnchainLink.onchain_fellowship_referendum[0]?.referendumId;
		postStatus = fellowshipReferendumPost?.onchain_link?.onchain_fellowship_referendum?.[0]?.referendumStatus?.[0].status;
	}

	if (post && isProposal) {
		proposalPost = post as ProposalPostFragment;
		definedOnchainLink = proposalPost.onchain_link as OnchainLinkProposalFragment;
		onchainId = definedOnchainLink.onchain_proposal_id;
		postStatus = proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isMotion) {
		motionPost = post as MotionPostFragment;
		definedOnchainLink = motionPost.onchain_link as OnchainLinkMotionFragment;
		onchainId = definedOnchainLink.onchain_motion_id;
		postStatus = motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.[0].status;
		if (definedOnchainLink.onchain_referendum_id || definedOnchainLink.onchain_referendum_id === 0){
			redirection = {
				link: `/referendum/${definedOnchainLink.onchain_referendum_id}`,
				text: `Referendum #${definedOnchainLink.onchain_referendum_id}`
			};
		}
	}

	if (post && isTreasuryProposal) {
		treasuryPost = post as TreasuryProposalPostFragment;
		definedOnchainLink = treasuryPost.onchain_link as OnchainLinkTreasuryProposalFragment;
		onchainId = definedOnchainLink.onchain_treasury_proposal_id;
		postStatus = treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.[0].status;
		if (definedOnchainLink.onchain_motion_id || definedOnchainLink.onchain_motion_id === 0){
			redirection = {
				link: `/motion/${definedOnchainLink.onchain_motion_id}`,
				text: `Motion #${definedOnchainLink.onchain_motion_id}`
			};
		}
	}

	if (post && isTipProposal) {
		tipPost = post as TipPostFragment;
		definedOnchainLink = tipPost.onchain_link as OnchainLinkTipFragment;
		onchainId = definedOnchainLink.onchain_tip_id;
		postStatus = tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.[0].status;
	}

	const isDiscussion = (post:any | ReferendumV2PostFragment | FellowshipReferendumPostFragment | TechCommitteeProposalPostFragment | BountyPostFragment | ChildBountyPostFragment | TipPostFragment | TreasuryProposalPostFragment | MotionPostFragment | ProposalPostFragment | DiscussionPostFragment | ReferendumPostFragment ): post is DiscussionPostFragment => {
		if (!isReferendumV2 && !isTechCommitteeProposal && !isReferendum && !isProposal && !isMotion && !isTreasuryProposal && !isTipProposal && !isBounty && !isChildBounty && !isFellowshipReferendum ) {
			return (post as DiscussionPostFragment) !== undefined;
		}

		return false;
	};

	if (!post) {
		const postCategory: PostCategory = isMotion ? PostCategory.MOTION : isProposal ? PostCategory.PROPOSAL : isReferendum ? PostCategory.REFERENDA : isTreasuryProposal ? PostCategory.TREASURY_PROPOSAL : isTipProposal ? PostCategory.TIP : isBounty ? PostCategory.BOUNTY : isTechCommitteeProposal ? PostCategory.TECH_COMMITTEE_PROPOSAL : isChildBounty ? PostCategory.CHILD_BOUNTY : PostCategory.DISCUSSION;

		if(isReferendumV2) {
			return <div className='mt-16'><PostEmptyState postCategory={PostCategory.REFERENDA} /></div>;
		}
		if(isFellowshipReferendum) {
			return <div className='mt-16'><PostEmptyState postCategory={PostCategory.FELLOWSHIP_REFERENDA} /></div>;
		}
		return <div className='mt-16'><PostEmptyState postCategory={postCategory} /></div>;
	}

	const isBountyProposer = isBounty && bountyPost?.onchain_link?.proposer_address && addresses?.includes(bountyPost.onchain_link.proposer_address);
	const isChildBountyProposer = isChildBounty && childBountyPost?.onchain_link?.proposer_address && addresses?.includes(childBountyPost.onchain_link.proposer_address);
	const isProposalProposer = isProposal && proposalPost?.onchain_link?.proposer_address && addresses?.includes(proposalPost.onchain_link.proposer_address);
	const isReferendumProposer = isReferendum && referendumPost?.onchain_link?.proposer_address && addresses?.includes(referendumPost.onchain_link.proposer_address);
	const isReferendumV2Proposer = isReferendumV2 && referendumV2Post?.onchain_link?.proposer_address && addresses?.includes(referendumV2Post.onchain_link.proposer_address);
	const isFellowshipReferendumProposer = isFellowshipReferendum && fellowshipReferendumPost?.onchain_link?.proposer_address && addresses?.includes(fellowshipReferendumPost.onchain_link.proposer_address);
	const isMotionProposer = isMotion && motionPost?.onchain_link?.proposer_address && addresses?.includes(motionPost.onchain_link.proposer_address);
	const isTreasuryProposer = isTreasuryProposal && treasuryPost?.onchain_link?.proposer_address && addresses?.includes(treasuryPost.onchain_link.proposer_address);
	const isTipProposer = isTipProposal && tipPost?.onchain_link?.proposer_address && addresses?.includes(tipPost.onchain_link.proposer_address);
	const isTechCommitteeProposalProposer = isTechCommitteeProposal && techCommitteeProposalPost?.onchain_link?.proposer_address && addresses?.includes(techCommitteeProposalPost.onchain_link.proposer_address);
	const canEdit = !isEditing && (
		post.author?.id === id ||
		isProposalProposer ||
		isReferendumProposer ||
		isReferendumV2Proposer ||
		isFellowshipReferendumProposer ||
		isMotionProposer ||
		isTreasuryProposer ||
		isTipProposer ||
		isBountyProposer ||
		isTechCommitteeProposalProposer ||
		isFellowshipReferendumProposer ||
		isChildBountyProposer
	);

	const Sidebar = ({ className } : {className?:string}) => {
		return (
			<div className={`${className} flex flex-col w-full xl:w-4/12 mx-auto`}>
				<GovernanceSideBar
					isBounty={isBounty}
					isChildBounty={isChildBounty}
					isMotion={isMotion}
					isProposal={isProposal}
					isReferendum={isReferendum}
					isReferendumV2={isReferendumV2}
					isFellowshipReferendum={isFellowshipReferendum}
					isTipProposal={isTipProposal}
					isTreasuryProposal={isTreasuryProposal}
					isTechCommitteeProposal={isTechCommitteeProposal}
					onchainId={onchainId}
					onchainLink={definedOnchainLink}
					status={postStatus}
					canEdit={canEdit}
					startTime={post.created_at}
					tally={isReferendumV2 ? (post as any).onchain_link?.onchain_referendumv2?.[0]?.tally : undefined}
				/>
				{isDiscussion(post) && <Poll postId={post.id} canEdit={post.author?.id === id} />}
				<OptionPoll postId={post.id} canEdit={post.author?.id === id} />
			</div>
		);
	};

	const TrackerButtonComp = <>
		{id && !isNaN(Number(onchainId)) && isOnchainPost && !isEditing &&
			<TrackerButton
				onchainId={onchainId!}
				isBounty={isBounty}
				isMotion={isMotion}
				isProposal={isProposal}
				isReferendum={isReferendum}
				isReferendumV2={isReferendumV2}
				isFellowshipReferendum={isFellowshipReferendum}
				isTipProposal={isTipProposal}
				isTreasuryProposal={isTreasuryProposal}
				isTechCommitteeProposal={isTechCommitteeProposal}
			/>
		}
	</>;

	const handleOpenSidebar = (address:string) => {
		setSidebarOpen(true);
		setProposerAddress(address);
	};

	const getOnChainTabs = () => {
		if (isDiscussion(post)) return [];

		const onChainTabs = [
			{ label: 'Timeline',
				key: 'timeline',
				children: <PostTimeline
					isBounty={isBounty}
					isMotion={isMotion}
					isProposal={isProposal}
					isReferendum={isReferendum}
					isReferendumV2={isReferendumV2}
					isFellowshipReferendum={isFellowshipReferendum}
					isTipProposal={isTipProposal}
					isTreasuryProposal={isTreasuryProposal}
					isTechCommitteeProposal={isTechCommitteeProposal}
					isChildBounty={isChildBounty}
					referendumPost={referendumPost}
					referendumV2Post={referendumV2Post}
					proposalPost={proposalPost}
					motionPost={motionPost}
					treasuryPost={treasuryPost}
					tipPost={tipPost}
					bountyPost={bountyPost}
					childBountyPost={childBountyPost}
					techCommitteeProposalPost={techCommitteeProposalPost}
				/>
			},
			{ label: 'On Chain Info',
				key: 'onChainInfo',
				children: <PostOnChainInfo
					isBounty={isBounty}
					isMotion={isMotion}
					isProposal={isProposal}
					isReferendum={isReferendum}
					isReferendumV2={isReferendumV2}
					isFellowshipReferendum={isFellowshipReferendum}
					isTipProposal={isTipProposal}
					isTreasuryProposal={isTreasuryProposal}
					isTechCommitteeProposal={isTechCommitteeProposal}
					isChildBounty={isChildBounty}
					definedOnchainLink={definedOnchainLink}
					handleOpenSidebar={handleOpenSidebar}
				/>
			}
		];

		return onChainTabs;
	};

	const tabItems: any[] = [
		{ label: 'Description',
			key: 'description',
			children: <PostDescription
				id={id}
				post={post as any}
				isEditing={isEditing}
				canEdit={canEdit}
				toggleEdit={toggleEdit}
				isOnchainPost={isOnchainPost}
				TrackerButtonComp={TrackerButtonComp}
				Sidebar={Sidebar}
				refetch={refetch}
			/>
		},
		...getOnChainTabs()
	];

	const parentBountyId = isChildBounty && (definedOnchainLink as OnchainLinkChildBountyFragment).onchain_child_bounty?.[0]?.parentBountyId;

	const getLatestDiscussionState = () => {
		if(!isDiscussion(post)) return;

		const latestState = {
			link: '',
			text: ''
		};

		if(post.onchain_link?.onchain_referendum_id) {
			latestState.link = `/referendum/${post.onchain_link.onchain_referendum_id}`;
			latestState.text = `Referendum #${post.onchain_link.onchain_referendum_id}`;
		} else if (post.onchain_link?.onchain_motion_id) {
			latestState.link = `/motion/${post.onchain_link.onchain_motion_id}`;
			latestState.text = `Motion #${post.onchain_link.onchain_motion_id}`;
		} else if (post.onchain_link?.onchain_treasury_proposal_id) {
			latestState.link = `/treasury/${post.onchain_link.onchain_treasury_proposal_id}`;
			latestState.text = `Treasury Proposal #${post.onchain_link.onchain_treasury_proposal_id}`;
		} else if (post.onchain_link?.onchain_proposal_id) {
			latestState.link = `/proposal/${post.onchain_link.onchain_proposal_id}`;
			latestState.text = `Proposal #${post.onchain_link.onchain_proposal_id}`;
		}

		return latestState;
	};

	return (
		<>
			<div className={`${className} flex flex-col xl:flex-row`}>
				<div className='flex-1 w-full xl:w-8/12 mx-auto xl:mr-9 mb-6 xl:mb-0'>

					{
						trackName && ( isReferendumV2 || isFellowshipReferendum)  && <AboutTrackCard trackName={trackName} className='mb-6' />
					}

					{redirection.link &&
						<Link to={redirection.link}>
							<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full mb-6 dashboard-heading'>
								This proposal is now <span className='text-pink_primary'>{redirection.text}</span>
							</div>
						</Link>
					}

					{ post && isBounty && postStatus === 'PendingPayout' && (
						<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full mb-6 dashboard-heading flex items-center gap-x-2'>
							<span>The bounty payout is ready to be claimed</span>
							<ClaimPayoutModal
								parentBountyId={(definedOnchainLink as OnchainLinkBountyFragment).onchain_bounty[0]?.bountyId}
							/>
						</div>
					)}
					{ post && isChildBounty && postStatus === 'PendingPayout' && (
						<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full mb-6 dashboard-heading flex items-center gap-x-2'>
							<span>The child bounty payout is ready to be claimed</span>
							<ClaimPayoutModal
								parentBountyId={(definedOnchainLink as OnchainLinkChildBountyFragment).onchain_child_bounty[0]?.parentBountyId}
								childBountyId={(definedOnchainLink as OnchainLinkChildBountyFragment).onchain_child_bounty[0]?.childBountyId}
								isChildBounty={true}
							/>
						</div>
					)}

					{
						isDiscussion(post) && getLatestDiscussionState()?.link &&
						<Link to={getLatestDiscussionState()?.link!}>
							<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full mb-6 dashboard-heading'>
								This discussion is now <span className='text-pink_primary'>{getLatestDiscussionState()?.text}</span>
							</div>
						</Link>
					}

					{
						isChildBounty && parentBountyId &&
						<Link to={`/bounty/${parentBountyId}`}>
							<div className='bg-white drop-shadow-md p-3 md:p-6 rounded-md w-full mb-6 dashboard-heading'>
								This is a child bounty of <span className='text-pink_primary'>Bounty #{parentBountyId}</span>
							</div>
						</Link>
					}

					{/* Post Content */}
					<div className='bg-white drop-shadow-md p-3 md:p-4 lg:p-6 rounded-md w-full mb-6'>
						{isEditing && <EditablePostContent
							post={post as any}
							refetch={refetch}
							toggleEdit={toggleEdit}
						/>}

						{!isEditing && <>
							<PostHeading className='mb-8' isTipProposal={isTipProposal} onchainId={onchainId} post={post as any} postStatus={postStatus} />

							<Tabs
								type="card"
								className='ant-tabs-tab-bg-white text-sidebarBlue font-medium'
								items={tabItems}
							/>
						</>}

					</div>
				</div>

				{!isEditing ? <Sidebar className='hidden xl:block' />: null}
			</div>

			<SidebarRight
				open={sidebarOpen}
				closeSidebar={() => setSidebarOpen(false)}
			>
				{ proposerAddress && <OtherProposals proposerAddress={proposerAddress} currPostOnchainID={Number(onchainId)} closeSidebar={() => setSidebarOpen(false)} /> }
			</SidebarRight>
		</>
	);
};

export default Post;