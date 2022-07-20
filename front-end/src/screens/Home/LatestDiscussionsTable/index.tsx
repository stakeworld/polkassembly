// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Tab, Table } from 'semantic-ui-react';
import NoLatestActivity from 'src/ui-components/NoLatestActivity';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import { useLatestDiscussionPostsQuery } from '../../../generated/graphql';
import FilteredError from '../../../ui-components/FilteredError';
import LatestActivityCard from '../LatestActivityCard';
import LatestActivityTableHeader from '../LatestActivityTableHeader';
import LatestActivityTableRow from '../LatestActivityTableRow';

interface Props {
	className?: string
}

const LatestDiscussionsTable = ({ className }: Props) => {

	const defaultAddressField = getDefaultAddressField();

	const { data, error, refetch } = useLatestDiscussionPostsQuery({
		variables: {
			limit: 10
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <Tab.Pane loading={!data} className='tab-panel'><FilteredError text={error.message} /></Tab.Pane>;

	if (data) {
		const noPost = !data.posts || !data.posts.length;

		if (noPost)
			return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
				<NoLatestActivity className={className} />
			</Tab.Pane>;

		return <Tab.Pane loading={!data} className={`${className} tab-panel`}>
			<Table className='hidden-mobile' basic='very' striped unstackable selectable>
				<LatestActivityTableHeader className={className} hideSerialNum={false} />

				<Table.Body>
					{data.posts.map(
						(post) => {
							return !!post?.author?.username &&
								<LatestActivityTableRow
									key={post.id}
									postId={post.id}
									address={post.author[defaultAddressField]!}
									onchainId={post.id}
									title={post.title}
									postType='discussion'
									created_at={post.created_at}
									username={post.author.username}
									hideSerialNum={false}
								/>
							;
						}
					)}
				</Table.Body>
			</Table>

			<div className='hidden-desktop cards-container'>
				{data.posts.map(
					(post) => {
						return !!post?.author?.username &&
							<LatestActivityCard
								key={post.id}
								postId={post.id}
								address={post.author[defaultAddressField]!}
								onchainId={post.id}
								title={post.title}
								postType='discussion'
								created_at={post.created_at}
								username={post.author.username}
								hideSerialNum={false}
							/>
						;
					}
				)}
			</div>
		</Tab.Pane>;
	}

	return <Tab.Pane loading className='tab-panel'></Tab.Pane>;

};

export default styled(LatestDiscussionsTable)`
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
