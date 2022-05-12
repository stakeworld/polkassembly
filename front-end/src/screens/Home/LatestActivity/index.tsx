// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { Button, Icon, Input, Label, Menu, Tab } from 'semantic-ui-react';
import { useBountiesCountQuery,useDemocracyProposalCountQuery, useDemocracyTreasuryProposalCountQuery,useDiscussionsCountQuery,useGetLatestMotionsCountQuery, usePostsCountQuery, useReferundumCountQuery, useSearchPostsLazyQuery, useTipProposalCountQuery } from 'src/generated/graphql';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';

// import SearchBar from 'src/ui-components/SearchBar';
// import filterIMG from '../../../assets/latest-activity-filter.png';
// import LatestActivitySearchPage from '../LatestActivitySearchPage';
import LatestAllPostsTable from '../LatestAllPostsTable';
import LatestBountiesTable from '../LatestBountiesTable';
import LatestDiscussionsTable from '../LatestDiscussionsTable';
import LatestMotionsTable from '../LatestMotionsTable';
import LatestProposalsTable from '../LatestProposalsTable';
import LatestReferendaTable from '../LatestReferendaTable';
import LatestTipsTable from '../LatestTipsTable';
import LatestTreasuryTable from '../LatestTreasuryTable';
import SearchPostsTable from '../SearchPostsTable';

interface Props {
  className?: string
}

const LatestActivity = ({ className }: Props) => {
	const [searchPostsQuery, { data, loading }] = useSearchPostsLazyQuery();

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

	const [showSearchBar, setShowSearchBar] = useState<boolean>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const toggleSearchBar = () => {
		setShowSearchBar(!showSearchBar);
		setActiveIndex(0);
		setTimeout(() => {
			document.querySelector('.tab-menu')!.scrollLeft += 200;
		}, 10);
	};

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setSearchValue(value || '');

		if (!value) {
			return;
		}

		searchPostsQuery({
			variables: {
				term: `%${value}%`
			}
		});

		if (data && data.posts && data.posts.length > 0) {
			setSearchResults(data.posts);
		}

	}

	const searchButton =
			showSearchBar ? <Input className='menu-right no-label-item' autoFocus loading={loading} fluid icon='search' iconPosition='left' placeholder='Search By Proposal Keyword' value={searchValue} onChange={debounce(handleSearchChange, 500, { leading: true })} />
				:
				<Button id='search-btn' onClick={toggleSearchBar} className='menu-right no-label-item'> <Icon name='search' /> </Button>;

	const panes = [
		{
			menuItem: <Menu.Item key='all'>All <Label circular>{ postsData?.posts_aggregate.aggregate?.count }</Label></Menu.Item>,
			render: () => showSearchBar && searchValue ? <SearchPostsTable className='tab-panel' loading={loading} searchResults={searchResults} /> : <LatestAllPostsTable className='tab-panel' />
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
		{
			menuItem: <Menu.Item className='menu-right no-label-item menu-search-btn' key='search'>{searchButton}</Menu.Item>
		}
		// {
		// menuItem: <Menu.Item className='menu-right no-label-item' key='search'> <Icon name='search' /> </Menu.Item>,
		// render: () => <LatestActivitySearchPage className='tab-panel' />
		// }
	];

	const [activeTabIndex, setActiveIndex] = useState<number>(0);

	const handleChange = (e: any, data:any) => {
		if(data.activeIndex == 8){
			setActiveIndex(0);
		}else{
			setActiveIndex(data.activeIndex);
			setSearchValue('');
			setShowSearchBar(false);
		}
	};

	return (
		<div className={className}>
			<h1 className='table-heading'>Latest activity <Button id='search-btn' onClick={toggleSearchBar} className='menu-right no-label-item hidden-lg'> <Icon size='large' name='search' /> </Button></h1>
			<div className='hidden-desktop'>
				{ showSearchBar && <Input className='menu-right no-label-item' autoFocus loading={loading} fluid icon='search' iconPosition='left' placeholder='Search By Proposal Keyword' value={searchValue} onChange={debounce(handleSearchChange, 500, { leading: true })} /> }
			</div>
			<Tab className='tab-header' activeIndex={activeTabIndex} onTabChange={handleChange} menu={{ className:'tab-menu', pointing: true, secondary: true }} panes={panes} />
		</div>
	);
};

export default styled(LatestActivity)`
	&&& {
		.hidden-mobile {
			@media only screen and (max-width: 767px) {
				display: none !important;
			}
		}

		.hidden-desktop {
			@media only screen and (min-width: 767px) {
				display: none !important;
			}
		}

		.hidden-lg {
			@media only screen and (min-width: 992px) {
				display: none !important;
			}
		}

		h1 {
			font-size: 30px;
			margin-bottom: 16px;
		}

		#search-btn {
			background: transparent;

			&.hidden-lg {
				padding-right: 0 !important;
			}
		}

		.mobile-action-bar {
			background: #fff;
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
			display: flex;
			justify-content: flex-end;
			margin-bottom: -10px;

			@media only screen and (max-width: 767px) {
				background: transparent;
			}

			.menu-right {
				margin-left: 0;
				width: 100%
			}

			button {
				background: transparent;
    		padding-right: 23px;
    		padding-top: 12px;
				width: 30px !important;

				.icon{
					font-size: 16px !important;
				}
			}

			@media only screen and (min-width: 992px) {
				display: none;
			}
		}
		
		.menu-right{
			margin-left: auto !important;
			
			&.menu-search-btn {
				@media only screen and (max-width: 992px) {
					display: none;
				}
			}
		}

		.table-heading {
			display: flex;
		}

		.tab-header {
			background: white;
			border-top-left-radius: 0.5em;
			border-top-right-radius: 0.5em;
			padding-top: 0.5em;

			@media only screen and (max-width: 767px) {
				background: transparent;

				.item {
					border-bottom: 5px solid #D8D8D8 !important;
				}
			}


			.item:hover {
				border-bottom: 5px solid #E5007A !important;
			}

			.menu {
				margin-bottom: 0 !important;
			}

			button{
				background: transparent !important;
			}

			.input {
				margin-top: -10px;
				margin-left: 1em;
				width: 252px;
				height: 36px;

				input {
					border-radius: 5px;
					font-family: 'Roboto' !important;
				}
			}
		}
	
		.tab-menu {
			overflow-x: hidden;
			overflow-y: hidden;

			@media only screen and (max-width: 767px) {
				overflow-x: auto;
				background: transparent !important;
				-ms-overflow-style: none;  /* Internet Explorer 10+ */
				scrollbar-width: none;  /* Firefox */

				&::-webkit-scrollbar {
					display: none;  /* Safari and Chrome */
				}
			}

			&:hover {
				overflow-x: auto;
			}

			.no-label-item:hover {
				border-bottom: 1px solid #fff !important;
			}

			.no-label-item {
				align-self: center !important;
				padding-right: 6px;
				&.active {
					padding: 0;
				}
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

			@media only screen and (max-width: 767px) {
				background: transparent !important;
				-ms-overflow-style: none;  /* Internet Explorer 10+ */
				scrollbar-width: none;  /* Firefox */

				&::-webkit-scrollbar {
					display: none;  /* Safari and Chrome */
				}
			}

			table tbody {
				tr:nth-child(2n){
					background-color: rgba(30, 30, 40, 0.03) !important;
				}

				tr:hover {
					background-color: rgba(0, 0, 0, 0.1) !important;
					
				}
			}
			
			.cards-container {
				padding-top: 16px;

				@media only screen and (max-width: 767px) {
					padding-top: 0;
				}

				.dot-divider {
					height: 4px;
					width: 4px;
					background-color: #75767C;
					border-radius: 50%;
					display: inline-block;
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
