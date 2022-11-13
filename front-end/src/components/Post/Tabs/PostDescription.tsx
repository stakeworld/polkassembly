// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button, Timeline } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import PASmallCirclePNG from 'src/assets/pa-small-circle.png';
import { CommentFieldsFragment, DiscussionPostFragment, Exact, MotionPostFragment,ProposalPostFragment, ReferendumPostFragment,  TreasuryProposalPostFragment } from 'src/generated/graphql';
import useBlockTime from 'src/hooks/useBlockTime';
import Markdown from 'src/ui-components/Markdown';
import blockToTime from 'src/util/blockToTime';

import CreateOptionPoll from '../ActionsBar/OptionPoll/CreateOptionPoll';
import PostReactionBar from '../ActionsBar/Reactionbar/PostReactionBar';
import ReportButton from '../ActionsBar/ReportButton';
import ShareButton from '../ActionsBar/ShareButton';
import SubscriptionButton from '../ActionsBar/SubscriptionButton/SubscriptionButton';
import Comments from '../Comment/Comments';
import PostCommentForm from '../PostCommentForm';

interface Props {
	className?: string;
	canEdit: boolean | '' | undefined;
	id: number | null | undefined;
	postStatus?: string;
	isEditing: boolean;
	isOnchainPost: boolean;
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment| TreasuryProposalPostFragment| MotionPostFragment;
	toggleEdit: () => void
	TrackerButtonComp: JSX.Element
	Sidebar: ({ className }: {className?: string | undefined;}) => JSX.Element
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

interface ITimeline {
	date: moment.Moment;
	status: string;
	id: number;
}

const PostDescription = ({ className, canEdit, id, isEditing, isOnchainPost, post, postStatus, refetch, toggleEdit, Sidebar, TrackerButtonComp } : Props) => {
	const { content, onchain_link } = post;

	const { blocktime } = useBlockTime();
	const getTimelineDate = useCallback((no: number) => {
		const time = blockToTime(no, blocktime);
		const timeArr = time.split(' ');
		const days = timeArr[0].replace('d', '');
		const hours = timeArr[1].replace('h', '');
		const minutes = timeArr[2].replace('m', '');
		const date = moment().subtract(Number(days), 'days').subtract(Number(hours), 'hours').subtract(Number(minutes), 'minutes');
		return date;
	}, [blocktime]);

	const [timeline, setTimeline] = useState(0);
	const [comments, setComments] = useState<CommentFieldsFragment[]>([]);
	useEffect(() => {
		setComments(post?.comments?.filter((_, index) => {
			return index < 8;
		}));
	}, [post?.comments]);

	const [timelines, setTimelines] = useState<ITimeline[]>([]);

	useEffect(() => {
		if (onchain_link) {
			const timelines: ITimeline[] = [];

			const { onchain_proposal, onchain_referendum, onchain_treasury_spend_proposal, onchain_tech_committee_proposal, onchain_motion, onchain_tip, onchain_bounty, onchain_child_bounty } = onchain_link as any;

			if (onchain_proposal?.length > 0) {
				onchain_proposal[0]?.proposalStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: 'Proposal'
					});
				});
			}
			if (onchain_referendum?.length > 0) {
				onchain_referendum[0]?.referendumStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: 'Referendum'
					});
				});
			}
			if (onchain_treasury_spend_proposal?.length > 0) {
				onchain_treasury_spend_proposal[0]?.treasuryStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: 'Proposal'
					});
				});
			}
			if (onchain_bounty?.length > 0) {
				onchain_bounty[0]?.bountyStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: obj?.status.replace('Bounty', '') || ''
					});
				});
			}
			if (onchain_child_bounty?.length > 0) {
				onchain_child_bounty[0]?.childBountyStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: obj?.status || ''
					});
				});
			}
			if (onchain_tip?.length > 0) {
				onchain_tip[0]?.tipStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: obj?.status.replace('Tip', '') || ''
					});
				});
			}
			if (onchain_motion?.length > 0) {
				onchain_motion[0]?.motionStatus?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: 'Motion'
					});
				});
			}
			if (onchain_tech_committee_proposal?.length > 0) {
				onchain_tech_committee_proposal[0]?.status?.forEach((obj: any) => {
					timelines.push({
						date: getTimelineDate(obj?.blockNumber?.number),
						id: timelines.length + 1,
						status: obj?.status || ''
					});
				});
			}
			setTimelines(timelines.sort((a, b) => b.date.diff(a.date)));
		}
	}, [onchain_link, getTimelineDate]);

	return (
		<div className={`${className} mt-4`}>
			{content && <Markdown md={content} />}

			{/* Actions Bar */}
			<div id='actions-bar' className={`flex md:items-center mt-9 ${canEdit && 'flex-col'} md:flex-row mb-8`}>
				<div className='flex items-center'>
					<PostReactionBar className='reactions' postId={post.id} />
					{id && !isEditing && <SubscriptionButton postId={post.id}/>}
					{canEdit && <Button className={'text-pink_primary flex items-center border-none shadow-none px-1.5'} onClick={toggleEdit}><FormOutlined />Edit</Button>}
				</div>
				<div className='flex items-center'>
					{id && !isEditing && !isOnchainPost && <ReportButton type='post' contentId={`${post.id}`} />}
					{canEdit && !isEditing && <CreateOptionPoll postId={post.id} />}
					{TrackerButtonComp}
					<ShareButton title={post.title} />
				</div>
			</div>

			{!isEditing && <div className='flex lg:hidden mb-8 mx-2'><Sidebar /></div>}

			<div className='flex relative'>
				{
					onchain_link &&
					<div style={{
						height: `${window.innerHeight}px`
					}} className='hidden xl:flex mr-9 min-w-[120px] sticky top-0 py-4 xl:items-center'>
						<Timeline className='flex flex-col h-5/6 w-full' mode='right'>
							<Timeline.Item style={{
								height: '100%'
							}}  dot={<img style={ { maxWidth:'20px' } } src={PASmallCirclePNG} />}>
								<button onClick={() => {
									setTimeline(0);
									setComments(post?.comments?.filter((_, index) => {
										return index < 8;
									}));
								}} className={`flex flex-col border-none outline-none items-end w-full ${timeline === 0? 'text-sidebarBlue':'text-navBlue'}`}>
									<span>Today</span>
									<span>{postStatus}</span>
								</button>
							</Timeline.Item>
							{timelines.map(({ date, id, status }) => {
								return (<Timeline.Item style={{
									height: '100%'
								}} color={`${timeline === id? '#334D6E':'#90A0B7'}`} key={id}>
									<button onClick={() => {
										setTimeline(id);
										setComments(comments.filter((comment) => {
											const commentDate = moment(comment?.updated_at);
											const index = timelines.findIndex((v) => (v.id === id));
											if (index === timelines.length - 1) {
												return commentDate.isSameOrBefore(timelines[index].date);
											} else {
												return commentDate.isSameOrBefore(timelines[index].date) && commentDate.isAfter(timelines[index + 1].date);
											}
										}));
									}} className={`flex flex-col border-none outline-none items-end w-full ${timeline === id? 'text-sidebarBlue':'text-navBlue'}`}>
										<span>{date.format('MMM DD')}</span>
										<span>{status}</span>
									</button>
								</Timeline.Item>);
							})}
						</Timeline>
					</div>
				}

				<div className='w-full'>
					<div className='text-sidebarBlue text-sm font-medium mb-5'>{comments.length} comments</div>
					{ id && <PostCommentForm postId={post.id} refetch={refetch} /> }

					{ !!comments?.length &&
						<>
							<Comments
								className='ml-0 xl:ml-4'
								comments={comments}
								refetch={refetch}
							/>
							<div>
								<Button
									className='border-none outline-none bg-transparent shadow-none text-sm font-medium text-sidebarBlue'
									onClick={() => setComments(post?.comments)}
								>
									Load {post?.comments.length - comments.length} older comments
								</Button>
							</div>
						</>
					}
				</div>
			</div>

		</div>
	);
};

export default PostDescription;