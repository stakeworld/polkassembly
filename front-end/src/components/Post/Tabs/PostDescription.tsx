// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import styled from '@xstyled/styled-components';
import { Anchor, Button } from 'antd';
import BN from 'bn.js';
import moment from 'moment';
import React from 'react';
// import PASmallCirclePNG from 'src/assets/pa-small-circle.png';
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

const { Link: AnchorLink } = Anchor;

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
	commentsCount: number;
	firstCommentId: string;
}

const getTimelineDate = (no: number, currentBlock: BN) => {
	const time = blockToTime(currentBlock.toNumber() - no);
	const timeArr = time.split(' ');

	if (!timeArr[0] || !timeArr[1] || !timeArr[2]) {
		return moment().utc();
	}

	const days = Number(timeArr[0].replace('d', ''));
	const hours = Number(timeArr[1].replace('h', ''));
	const minutes = Number(timeArr[2].replace('m', ''));
	const duration = moment.duration({ 'days': days, 'hours': hours, 'minutes': minutes });
	const date = moment().utc().subtract(duration);
	return date;
};

const PostDescription = ({ className, canEdit, id, isEditing, isOnchainPost, post, refetch, toggleEdit, Sidebar, TrackerButtonComp } : Props) => {
	const targetOffset = window.innerHeight / 2;

	const { content, onchain_link } = post;
	const currentBlock = useCurrentBlock();

	const getCommentCountAndFirstIdBetweenDates = (startDate: moment.Moment, endDate: moment.Moment) => {
		const comments = post.comments.filter((comment) => {
			const commentDate = moment(comment.created_at);
			return commentDate.isBetween(startDate, endDate, 'minutes' , '[)');
		});

		return {
			count: comments.length,
			firstCommentId: comments.length > 0 ? comments[0].id : ''
		};
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	let timelines: ITimeline[] = [];

	if (onchain_link && currentBlock && post.comments.length > 0) {
		const { onchain_proposal, onchain_referendum, onchain_treasury_spend_proposal, onchain_tech_committee_proposal, onchain_motion } = onchain_link as any;

		if (onchain_proposal?.length > 0 && onchain_proposal[0]?.proposalStatus.length > 0) {
			const obj = onchain_proposal[0]?.proposalStatus?.at(-1);
			timelines.push({
				commentsCount: 0,
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				firstCommentId: '',
				id: timelines.length + 1,
				status: 'Proposal'
			});

			if (onchain_referendum?.length > 0 && onchain_referendum[0]?.referendumStatus.length > 0) {
				const obj = onchain_referendum[0]?.referendumStatus?.at(-1);
				timelines.push({
					commentsCount: 0,
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					firstCommentId: '',
					id: timelines.length + 1,
					status: 'Referendum'
				});
			}
		}

		if (onchain_treasury_spend_proposal?.length > 0 && onchain_treasury_spend_proposal[0]?.treasuryStatus.length > 0) {
			const obj = onchain_treasury_spend_proposal[0]?.treasuryStatus?.at(-1);
			timelines.push({
				commentsCount: 0,
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				firstCommentId: '',
				id: timelines.length + 1,
				status: 'Treasury Proposal'
			});

			if (onchain_motion?.length > 0 && onchain_motion[0]?.motionStatus.length > 0) {
				const obj = onchain_motion[0]?.motionStatus?.at(-1);
				timelines.push({
					commentsCount: 0,
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					firstCommentId: '',
					id: timelines.length + 1,
					status: 'Motion'
				});
			}
		}

		if (!(onchain_treasury_spend_proposal?.length > 0) && onchain_motion?.length > 0 && onchain_motion[0]?.motionStatus.length > 0) {
			const obj = onchain_motion[0]?.motionStatus?.at(-1);
			timelines.push({
				commentsCount: 0,
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				firstCommentId: '',
				id: timelines.length + 1,
				status: 'Motion'
			});

			if (onchain_referendum?.length > 0 && onchain_referendum[0]?.referendumStatus.length > 0) {
				const obj = onchain_referendum[0]?.referendumStatus?.at(-1);
				timelines.push({
					commentsCount: 0,
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					firstCommentId: '',
					id: timelines.length + 1,
					status: 'Referendum'
				});
			}
		}

		if (onchain_tech_committee_proposal?.length > 0 && onchain_tech_committee_proposal[0]?.status.length > 0) {
			const obj = onchain_tech_committee_proposal[0]?.status?.at(-1);
			timelines.push({
				commentsCount: 0,
				date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
				firstCommentId: '',
				id: timelines.length + 1,
				status: 'Tech. Comm. Proposal'
			});
		}

		if(timelines.length > 1) {
			timelines = timelines.map((timelineObj, i) => {
				const { count, firstCommentId } = getCommentCountAndFirstIdBetweenDates(i === 0 ? moment(post.comments[0].created_at) : timelineObj.date, timelines[i + 1]?.date || moment());
				return{
					...timelineObj,
					commentsCount: count,
					firstCommentId
				};
			});
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleTimelineClick = (e: React.MouseEvent<HTMLElement>, link: {title: React.ReactNode; href: string;}) => {
		if(link.href === '#') {
			e.preventDefault();
			return;
		}
	};

	return (
		<div className={`${className} mt-4`}>
			{content && <Markdown md={content} />}

			{/* Actions Bar */}
			<div id='actions-bar' className={`flex flex-col md:items-center mt-9 ${canEdit && 'flex-col'} md:flex-row mb-8`}>
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
					<div className='hidden h-screen xl:block col-start-1 col-end-2 min-w-[100px] -ml-2 sticky top-[10%] pt-10'>
						<Anchor targetOffset={targetOffset} className='h-full min-w-[140px]' onClick={handleTimelineClick}>
							{timelines.map(({ commentsCount, date, firstCommentId, id, status }) => {
								return (
									<AnchorLink
										key={id}
										href={`#${firstCommentId}`}
										title={
											<div className='flex flex-col'>
												<div className='text-xs mb-1'>{date.format('MMM Do')}</div>
												<div className='mb-1 font-medium break-words whitespace-pre-wrap'>{status}</div>
												<div className='text-xs'>({commentsCount})</div>
											</div>
										}
									/>);
							})}
						</Anchor>
					</div>
				}

				<div className={`col-start-1 ${timelines.length > 1 && 'xl:col-start-3'} col-end-13`}>
					<div className='text-sidebarBlue text-sm font-medium mb-5'>{post.comments.length} comments</div>
					{ !!post.comments?.length &&
						<>
							<Comments
								comments={post.comments}
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

export default React.memo(styled(PostDescription)`
.ant-anchor-wrapper {
	.ant-anchor {
		display: flex;
		flex-direction: column;
		gap: 96px;
	}
}
`);