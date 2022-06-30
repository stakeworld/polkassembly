// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Tab, Table } from 'semantic-ui-react';
import NothingFoundCard from 'src/ui-components/NothingFoundCard';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import { useGetLatestPostsQuery } from '../../../generated/graphql';
import FilteredError from '../../../ui-components/FilteredError';
import LatestActivityCard from '../LatestActivityCard';
import LatestActivityTableHeader from '../LatestActivityTableHeader';
import LatestActivityTableRow from '../LatestActivityTableRow';

interface Props {
	className?: string
}

interface PostTypeData {
	method: string
	onChainId: number
	postTypeString: 'discussion' |'referenda' | 'proposal' | 'motion' | 'treasury proposal' | 'tech committee proposal' | 'bounty' | 'child bounty' | 'tip'
	status: string
	title: string
}

const LatestAllPostsTable = ({ className }:Props) => {

	const defaultAddressField = getDefaultAddressField();

	const { data, error, refetch } = useGetLatestPostsQuery({ variables: {
		limit: 10
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	function getPostTypeData(post: any): PostTypeData | null{
		let postType: string = '';

		const postData: PostTypeData = {
			method: '',
			onChainId: 0,
			postTypeString: 'proposal',
			status: '',
			title: post.title
		};

		if (!post.onchain_link){
			//is discussion post
			postData.postTypeString = 'discussion';
			postData.onChainId = post.id;
			return postData;
		}

		for (const key of Object.keys(post.onchain_link)) {
			if(/_id$/.test(key) && post.onchain_link[key]){
				postType = key;
				break;
			}
		}

		switch (postType){
		case 'onchain_bounty_id':
			postData.postTypeString = 'bounty';
			postData.method = '';
			postData.onChainId = post.onchain_link?.onchain_bounty_id;
			postData.status = post.onchain_link.onchain_bounty[0]?.bountyStatus?.[0].status;
			break;
		case 'onchain_motion_id':
			postData.postTypeString = 'motion';
			postData.method = post.onchain_link.onchain_motion[0]?.preimage?.method;
			postData.onChainId = post.onchain_link?.onchain_motion_id;
			postData.status = post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status;
			break;
		case 'onchain_proposal_id':
			postData.postTypeString = 'proposal';
			postData.method = post.onchain_link.onchain_proposal[0]?.preimage?.method;
			postData.onChainId = post.onchain_link?.onchain_proposal_id;
			postData.status = post.onchain_link.onchain_proposal[0]?.proposalStatus?.[0].status;
			break;
		case 'onchain_referendum_id':
			postData.postTypeString = 'referenda';
			postData.method = post.onchain_link.onchain_referendum[0]?.preimage?.method;
			postData.onChainId = post.onchain_link?.onchain_referendum_id;
			postData.status = post.onchain_link.onchain_referendum[0]?.referendumStatus?.[0].status;
			break;
		case 'onchain_tech_committee_proposal_id':
			postData.postTypeString = 'tech committee proposal';
			postData.method = post.onchain_link.onchain_tech_committee_proposal[0]?.preimage?.method;
			postData.onChainId = post.onchain_link?.onchain_tech_committee_proposal_id;
			postData.status = post.onchain_link.onchain_tech_committee_proposal[0]?.status?.[0].status;
			break;
		case 'onchain_treasury_proposal_id':
			postData.postTypeString = 'treasury proposal';
			postData.method = '';
			postData.onChainId = post.onchain_link?.onchain_treasury_proposal_id;
			postData.status = post.onchain_link.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
			break;
		case 'onchain_tip_id':
			postData.postTypeString = 'tip';
			postData.method = '';
			postData.onChainId = post.onchain_link?.onchain_tip_id;
			postData.status = post.onchain_link.onchain_tip[0]?.tipStatus?.[0].status;
			postData.title = post.title ? post.title : post.onchain_link.onchain_tip?.[0]?.reason;
			break;
		case 'onchain_child_bounty_id':
			postData.postTypeString = 'child bounty';
			postData.method = '';
			postData.onChainId = post.onchain_link?.onchain_child_bounty_id;
			postData.status = post.onchain_link.onchain_child_bounty[0]?.childBountyStatus?.[0].status;
			postData.title = post.title ? post.title : post.onchain_link.onchain_child_bounty?.[0]?.description;
		}

		return postData;
	}

	if (error?.message) return <Tab.Pane loading={!data} className='tab-panel'><FilteredError text={error.message}/></Tab.Pane>;

	if(data){
		const noPost = !data.posts || !data.posts.length;

		if (noPost)
			return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
				<NothingFoundCard className={className} text='There are currently no posts.'/>
			</Tab.Pane>;

		return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
			<Table className='hidden-mobile' basic='very' striped unstackable selectable>
				<LatestActivityTableHeader className={className} />

				<Table.Body>
					{data.posts.map(
						(post) => {
							const postTypeData = getPostTypeData(post);

							if(postTypeData){
								return postTypeData && !!post?.author?.username &&
									<LatestActivityTableRow
										key={post.id}
										postId={post.id}
										address={postTypeData.postTypeString == 'discussion' ? post.author[defaultAddressField]! : post.onchain_link?.proposer_address!}
										method={postTypeData.method ? postTypeData.method : undefined}
										onchainId={postTypeData?.onChainId}
										status={postTypeData.status}
										title={postTypeData.title}
										postType={postTypeData.postTypeString}
										created_at={post.created_at}
										username = {post.author.username}
									/>
								;
							}
							return null;
						}
					)}
				</Table.Body>
			</Table>

			<div className='hidden-desktop cards-container'>
				{data.posts.map(
					(post) => {
						const postTypeData = getPostTypeData(post);

						if(postTypeData){
							return postTypeData && !!post?.author?.username &&
							<LatestActivityCard
								key={post.id}
								postId={post.id}
								address={postTypeData.postTypeString == 'discussion' ? post.author[defaultAddressField]! : post.onchain_link?.proposer_address!}
								method={postTypeData.method ? postTypeData.method : undefined}
								onchainId={postTypeData?.onChainId}
								status={postTypeData.status}
								title={postTypeData.title}
								postType={postTypeData.postTypeString}
								created_at={post.created_at}
								username = {post.author.username}
							/>
							;
						}
						return null;
					}
				)}
			</div>
		</Tab.Pane>;
	}

	return <Tab.Pane loading className='tab-panel'></Tab.Pane>;

};

export default styled(LatestAllPostsTable)`
	&&& {
    .tab-header {
      background: white;
      border-top-left-radius: 0.5em;
      border-top-right-radius: 0.5em;
      padding-top: 0.5em;
      margin-left: 0.5em;
    }
  
    .tab-menu {
      overflow-x: auto;
      overflow-y: hidden;

      a.active {
        border-bottom: 5px solid #E5007A !important;
      }
    }
  
    .item:first-child{
      margin-left: 1em !important;
    }
  
    .item {
      font-size: 1.5em;
    }
  
    .tab-panel{
      background: white;
      border: none !important;
      width: 100% !important;
      margin-left: 0 !important;
      font-size: 1.5rem;
      overflow-x: auto;
      overflow-y: hidden;
    }
  
    .table-header{
      background: #F2F2F2;
  
      th {
        font-weight: 500 !important;
        padding-top: 1.5em;
        padding-bottom: 1.5em;

        :not(:first-child){
          span {
            border-left: 1px solid #ddd;
            padding: 0.3em 0 0.3em 1em;
            margin-left: -1em;
          }
        }
      }
    }

	}
`;
