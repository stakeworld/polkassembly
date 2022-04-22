// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { Icon, Label, Menu, Tab } from 'semantic-ui-react';
import { useBountiesCountQuery,useDemocracyProposalCountQuery, useDemocracyTreasuryProposalCountQuery,useDiscussionsCountQuery,useGetLatestMotionsCountQuery, usePostsCountQuery, useReferundumCountQuery, useTipProposalCountQuery } from 'src/generated/graphql';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';

// import filterIMG from '../../../assets/latest-activity-filter.png';
import LatestActivitySearchPage from '../LatestActivitySearchPage';
import LatestAllPostsTable from '../LatestAllPostsTable';
import LatestBountiesTable from '../LatestBountiesTable';
import LatestDiscussionsTable from '../LatestDiscussionsTable';
import LatestMotionsTable from '../LatestMotionsTable';
import LatestProposalsTable from '../LatestProposalsTable';
import LatestReferendaTable from '../LatestReferendaTable';
import LatestTipsTable from '../LatestTipsTable';
import LatestTreasuryTable from '../LatestTreasuryTable';

interface Props {
  className?: string
}

const LatestActivity = ({ className }: Props) => {
	const { data: postsData, refetch: postsRefetch } = usePostsCountQuery();
	const { data: discussionsData, refetch: discussionsRefetch } = useDiscussionsCountQuery();

	const { data: referendaData, refetch: referendaRefetch } = useReferundumCountQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	const { data: proposalData, refetch: proposalRefetch } = useDemocracyProposalCountQuery({ variables: {
		postTopic: post_topic.DEMOCRACY,
		postType: post_type.ON_CHAIN
	} });

	const { data: motionsData, refetch: motionsRefetch } = useGetLatestMotionsCountQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	const { data: treasuryProposalsData, refetch: treasuryProposalsRefetch } = useDemocracyTreasuryProposalCountQuery({ variables: {
		postTopic: post_topic.TREASURY,
		postType: post_type.ON_CHAIN
	} });

	const { data: bountiesData, refetch: bountiesRefetch } = useBountiesCountQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	const { data: tipsData, refetch: tipsRefetch } = useTipProposalCountQuery({ variables: {
		postTopic: post_topic.TREASURY,
		postType: post_type.ON_CHAIN
	} });

	useEffect(() => {
		postsRefetch();
	}, [postsRefetch]);

	useEffect(() => {
		discussionsRefetch();
	}, [discussionsRefetch]);

	useEffect(() => {
		referendaRefetch();
	}, [referendaRefetch]);

	useEffect(() => {
		proposalRefetch();
	}, [proposalRefetch]);

	useEffect(() => {
		motionsRefetch();
	}, [motionsRefetch]);

	useEffect(() => {
		treasuryProposalsRefetch();
	}, [treasuryProposalsRefetch]);

	useEffect(() => {
		bountiesRefetch();
	}, [bountiesRefetch]);

	useEffect(() => {
		tipsRefetch();
	}, [tipsRefetch]);

	const panes = [
		{
			menuItem: <Menu.Item key='all'>All <Label circular>{ postsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestAllPostsTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='discussions'>Discussions <Label circular>{ discussionsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestDiscussionsTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='proposals'>Proposals <Label circular>{ proposalData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestProposalsTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='referenda'>Referenda <Label circular>{ referendaData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestReferendaTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='motions'>Motions <Label circular>{ motionsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestMotionsTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='treasuryProposals'>Treasury Proposals <Label circular>{ treasuryProposalsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestTreasuryTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='bounties'>Bounties <Label circular>{ bountiesData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestBountiesTable className='tab-panel' />
		},
		{
			menuItem: <Menu.Item key='tips'>Tips <Label circular>{ tipsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => <LatestTipsTable className='tab-panel' />
		},
		// {
		// menuItem: <Button id='search-btn' className='menu-right no-label-item' key='search'> <Icon name='search' /> </Button>
		// }
		{
			menuItem: <Menu.Item className='menu-right no-label-item' key='search'> <Icon name='search' /> </Menu.Item>,
			render: () => <LatestActivitySearchPage className='tab-panel' />
		}
	// {
	// menuItem: <Menu.Item className='no-border' key='filter'>
	// <img style={ { height:'auto', width:'1.2em' } } src={filterIMG} alt="Filter" />
	// </Menu.Item>,
	// render: () => <LatestActivitySearchPage className='tab-panel' /> //TODO: Change to button
	// },
	// {
	// menuItem: <Menu.Item className='no-border' key='th'> <Icon name='th' /> </Menu.Item>,
	// render: () => <LatestActivitySearchPage className='tab-panel' /> //TODO: Change to button
	// }
	];

	// const [activeTabIndex, setActiveIndex] = useState<number>(0);

	// const handleChange = (e: any, data:any) => {
	// if(data.activeIndex == 8){
	// setActiveIndex(0);
	// }else{
	// setActiveIndex(data.activeIndex);
	// }
	// };

	return (
		<div className={className}>
			<h1 id='tab-header'>Latest activity</h1>
			{/* activeIndex={activeTabIndex} onTabChange={handleChange} */}
			<Tab className='tab-header' menu={{ className:'tab-menu', pointing: true, secondary: true }} panes={panes} />
		</div>
	);
};

export default styled(LatestActivity)`
	&&& {

		h1 {
			font-size: 30px;
			margin-bottom: 16px;
		}
		
		.menu-right{
			margin-left: auto !important;
		}

		.tab-header {
			background: white;
			border-top-left-radius: 0.5em;
			border-top-right-radius: 0.5em;
			padding-top: 0.5em;
			.item:hover {
				border-bottom: 5px solid #E5007A !important;
			}

			.menu {
				margin-bottom: 0 !important;
			}

			.search-btn{
				outline: solid red 1px !important;
			}
		}
	
		.tab-menu {
			overflow-x: auto;
			overflow-y: hidden;

			.no-label-item {
				padding-top: 1.15em;
				padding-bottom: 1.15em;
			}

			a {
				.label {
					color: rgba(0, 0, 0, 0.45) !important;
					background: #F0F0F0 !important;
					font-size: 12px !important;
				}
			}
	
			a.active {
				border-bottom: 5px solid #E5007A !important;

				.label {
					font-size: 12px !important;
					color: #E5007A !important;
					background: rgba(229, 0, 122, 0.1) !important;
				}

			}

			a.active.no-border {
				border-bottom: 5px solid #fff !important;
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
			overflow-y: auto;
			max-height: 500px;
			padding: 0 !important;

			table tbody {
				tr:nth-child(2n){
					background-color: rgba(30, 30, 40, 0.03) !important;
				}

				tr:hover {
					background-color: rgba(0, 0, 0, 0.1) !important;
					
				}
			}
			

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
