// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Tab, Table } from 'semantic-ui-react';
import NothingFoundCard from 'src/ui-components/NothingFoundCard';

import { useFetchLatestMotionPostsQuery } from '../../../generated/graphql';
import { post_type } from '../../../global/post_types';
import FilteredError from '../../../ui-components/FilteredError';
import LatestActivityTableHeader from '../LatestActivityTableHeader';
import LatestActivityTableRow from '../LatestActivityTableRow';

interface Props {
	className?: string
}

const LatestMotionsTable = ({ className }:Props) => {

	const { data, error, refetch } = useFetchLatestMotionPostsQuery({ variables: { limit: 10, postType: post_type.ON_CHAIN } });

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <Tab.Pane loading={!data} className='tab-panel'><FilteredError text={error.message}/></Tab.Pane>;

	if(data){
		const noPost = !data.posts || !data.posts.length;
		const atLeastOneCurrentMotion = data.posts.some((post) => {
			if(post.onchain_link?.onchain_motion.length || post.onchain_link?.onchain_motion_id){
				// this breaks the loop as soon as
				// we find a post that has a motion.
				return true;
			}
			return false;
		});

		if (!atLeastOneCurrentMotion || noPost)
			return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
				<NothingFoundCard className={className} text='There are currently no active motions.'/>
			</Tab.Pane>;
		return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
			<Table basic='very' striped unstackable selectable>
				<LatestActivityTableHeader className={className} />

				<Table.Body>
					{data.posts.map(
						(post) => {
							return !!post?.author?.username && (!!post.onchain_link?.onchain_motion.length || post.onchain_link?.onchain_motion_id) &&
								<LatestActivityTableRow
									key={post.id}
									postId={post.id}
									address={post.onchain_link.proposer_address}
									method={post.onchain_link.onchain_motion[0]?.preimage?.method}
									onchainId={post.onchain_link?.onchain_motion_id}
									status={post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status}
									title={post.title}
									postType='motion'
									created_at={post.created_at}
								/>
							;
						}
					)}
				</Table.Body>
			</Table>
		</Tab.Pane>;
	}

	return <Tab.Pane loading className='tab-panel'></Tab.Pane>;

};

export default styled(LatestMotionsTable)`
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
            padding 0.3em 0 0.3em 1em;
            margin-left: -1em;
          }
        }
      }
    }
	}
`;
