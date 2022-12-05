// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button, Timeline } from 'antd';
import BN from 'bn.js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PASmallCirclePNG from 'src/assets/pa-small-circle.png';
import { DiscussionPostFragment, Exact, MotionPostFragment,ProposalPostFragment, ReferendumPostFragment,  TreasuryProposalPostFragment } from 'src/generated/graphql';
import { useCurrentBlock } from 'src/hooks';
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
	comments: any[];
}

const getTimelineDate = (no: number, currentBlock: BN) => {
	const time = blockToTime(currentBlock.toNumber() - no);
	const timeArr = time.split(' ');
	const days = Number(timeArr[0].replace('d', ''));
	const hours = Number(timeArr[1].replace('h', ''));
	const minutes = Number(timeArr[2].replace('m', ''));
	const duration = moment.duration({ 'days': days, 'hours': hours, 'minutes': minutes });
	const date = moment().utc().subtract(duration);
	return date;
};

const PostDescription = ({ className, canEdit, id, isEditing, isOnchainPost, post, refetch, toggleEdit, Sidebar, TrackerButtonComp } : Props) => {
	const { content, onchain_link } = post;
	const currentBlock = useCurrentBlock();

	const [timelineid, setTimelineId] = useState(0);

	const getCommentsBetweenDates = (endDate: moment.Moment, startDate: moment.Moment | null) => {

		const comments = post.comments.filter((comment) => {
			const commentDate = moment(comment.created_at);
			if (startDate) {
				return commentDate.isBetween(startDate, endDate);
			} else {
				return commentDate.isBefore(endDate);
			}
		});

		return comments || [];
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	let timelines: ITimeline[] = [];

	if (onchain_link && currentBlock) {
		const { onchain_proposal, onchain_referendum, onchain_treasury_spend_proposal, onchain_tech_committee_proposal, onchain_motion } = onchain_link as any;

		if (onchain_proposal?.length > 0) {
			if (onchain_referendum?.length > 0) {
				const obj = onchain_referendum[0]?.referendumStatus?.[0];
				timelines.push({
					comments: [],
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Referendum'
				});
			}

			const obj = onchain_proposal[0]?.proposalStatus?.[0];
			timelines.push({
				comments: [],
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				id: timelines.length + 1,
				status: 'Proposal'
			});
		}

		if (onchain_treasury_spend_proposal?.length > 0) {
			if (onchain_motion?.length > 0) {
				const obj = onchain_motion[0]?.motionStatus?.[0];
				timelines.push({
					comments: [],
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Motion'
				});
			}

			const obj = onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0];
			timelines.push({
				comments: [],
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				id: timelines.length + 1,
				status: 'Treasury Proposal'
			});
		}

		if (!(onchain_treasury_spend_proposal?.length > 0) && onchain_motion?.length > 0) {
			if (onchain_referendum?.length > 0) {
				const obj = onchain_referendum[0]?.referendumStatus?.[0];
				timelines.push({
					comments: [],
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Referendum'
				});
			}

			const obj = onchain_motion[0]?.motionStatus?.[0];
			timelines.push({
				comments: [],
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				id: timelines.length + 1,
				status: 'Motion'
			});
		}

		if (onchain_tech_committee_proposal?.length > 0) {
			const obj = onchain_tech_committee_proposal[0]?.status?.[0];
			timelines.push({
				comments: [],
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				id: timelines.length + 1,
				status: 'Tech. Comm. Proposal'
			});
		}

		timelines = timelines.map((timelineObj, i) => ({
			...timelineObj,
			comments: i === 0 ? post.comments : getCommentsBetweenDates(timelineObj.date, timelines[i + 1]?.date || null)
		}));
	}

	useEffect(() => {
		if(timelines.length < 1 || timelineid) return;
		setTimelineId(timelines[0].id);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timelines]);

	const handleTimelineClick = ({ id } : {id: number}) => {
		setTimelineId(id);
	};

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

			{!isEditing && <div className='flex xl:hidden mb-8 mx-2'><Sidebar /></div>}

			<div className='block xl:grid grid-cols-12'>
				{
					onchain_link && !!post.comments?.length && currentBlock && timelines.length > 1 &&
					<div className='h-screen hidden xl:block col-start-1 col-end-2 min-w-[100px] -ml-2 sticky top-[10%] pt-10'>
						<Timeline className='flex flex-col h-full w-full' mode='right'>
							{timelines.map(({ date, id, status, comments }) => {
								return (
									<Timeline.Item
										className='h-full'
										dot={timelineid === id && <img style={ { maxWidth:'20px' } } src={PASmallCirclePNG} />}
										color={`${timelineid === id? '#334D6E':'#90A0B7'}`} key={id}
									>
										<button disabled={comments.length < 1} onClick={() => handleTimelineClick({ id })} className={`text-xs flex flex-col border-none outline-none items-end w-full ${timelineid === id ? 'text-sidebarBlue': `${comments.length < 1 ? 'text-gray-300' : 'text-navBlue'}`}`}>
											{
												<div className='flex flex-col mr-1 text-right gap-y-0.5'>
													{id > 0 && <div>{date.format('MMM Do')}</div>}
													<div>{status}</div>
													<div className={`${timelineid === id ? 'text-sidebarBlue' : `${comments.length < 1 ? 'text-gray-300' : 'text-navBlue'}`} text-xs font-normal`}>({comments.length})</div>
												</div>
											}
										</button>
									</Timeline.Item>);
							})}
						</Timeline>
					</div>
				}

				<div className={`col-start-1 ${timelines.length > 1 && 'xl:col-start-3'} col-end-13`}>
					<div className='text-sidebarBlue text-sm font-medium mb-5'>{post.comments.length} comments</div>
					{ !!post.comments?.length &&
						<>
							<Comments
								comments={timelineid ? timelines[timelineid - 1].comments : post.comments}
								refetch={refetch}
							/>
						</>
					}
					{ id && <PostCommentForm postId={post.id} refetch={refetch} /> }
				</div>
			</div>

		</div>
	);
};

export default React.memo(PostDescription);