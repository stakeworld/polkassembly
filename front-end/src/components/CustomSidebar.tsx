// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon, List } from 'semantic-ui-react';
import { useRouter } from 'src/hooks';

const CustomSidebar = ({ className } : { className?: string }): JSX.Element => {
	const SidebarItems = [
		{
			icon: <Icon name='th' />,
			link: '/',
			name: 'Overview'
		},
		{
			icon: <Icon name='comments outline' />,
			link: '/discussions',
			name: 'Discussions'
		},
		{
			icon: <Icon name='calendar alternate outline' />,
			link: '/calendar',
			name: 'Calendar'
		},
		{
			icon: <Icon name='newspaper outline' />,
			link: '/news',
			name: 'News'
		}
	];

	const TreasuryItems = [
		{
			icon: <Icon name='diamond' />,
			link: '/treasury-proposals',
			name: 'Proposals'
		},
		{
			icon: <Icon name='dollar sign' />,
			link: '/bounties',
			name: 'Bounties'
		},
		{
			icon: <Icon name='lightbulb outline' />,
			link: '/tips',
			name: 'Tips'
		}
	];

	const DemocracyItems = [
		{
			icon: <Icon name='file alternate outline' />,
			link: '/proposals',
			name: 'Proposals'
		},
		{
			icon: <Icon name='clipboard check' />,
			link: '/referenda',
			name: 'Referenda'
		}
	];

	const CouncilItems = [
		{
			icon: <Icon name='forward' />,
			link: '/motions',
			name: 'Motions'
		},
		{
			icon: <Icon name='users' />,
			link: '/council',
			name: 'Members'
		}
	];

	const TechCommItems = [
		{
			icon: <Icon name='file alternate outline' />,
			link: '/tech-comm-proposals',
			name: 'Proposals'
		}
	];

	const { history } = useRouter();
	const location = useLocation();

	const [activeRoute, setActiveRoute] = useState<string>('/');
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

	useEffect(() => {
		setActiveRoute(location.pathname);
	}, [location.pathname]);

	const toggleSidebarCollapse = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	return (
		<>
			<div className={className} style={ sidebarCollapsed ? { minWidth: '47px', padding: '1.5em 0.2em 0 0.2em', width:'47px' } : {} }>
				<div className='sidebar-parent'>
					<div onClick={ toggleSidebarCollapse } className='sidebar-collapse-btn' style={ sidebarCollapsed ? { left: '47px' } : {} }>
						<Icon size='small' name={sidebarCollapsed ? 'chevron right': 'chevron left' } />
					</div>

					<List size='large' verticalAlign='middle'>
						{/* Uncategorized */}
						{
							SidebarItems.map(item => (
								<List.Item key={item.name} onClick={() => history.push(item.link)} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Treasury */}
						<List.Item className='sidebar-heading'>
							<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
								<List.Header>Treasury</List.Header>
							</List.Content>
						</List.Item>
						{
							TreasuryItems.map(item => (
								<List.Item key={item.name} onClick={() => history.push(item.link)} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Democracy */}
						<List.Item className='sidebar-heading'>
							<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
								<List.Header>Democracy</List.Header>
							</List.Content>
						</List.Item>
						{
							DemocracyItems.map(item => (
								<List.Item key={item.name} onClick={() => history.push(item.link)} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Council */}
						<List.Item className='sidebar-heading'>
							<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
								<List.Header>Council</List.Header>
							</List.Content>
						</List.Item>
						{
							CouncilItems.map(item => (
								<List.Item key={item.name} onClick={() => history.push(item.link)} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* TechComm */}
						<List.Item className='sidebar-heading'>
							<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
								<List.Header>Tech. Comm.</List.Header>
							</List.Content>
						</List.Item>
						{
							TechCommItems.map(item => (
								<List.Item key={item.name} onClick={() => history.push(item.link)} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content style={ sidebarCollapsed ? { display: 'none' } : {} }>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}
					</List>
				</div>
			</div>
		</>
	);
};

export default styled(CustomSidebar)`
	background: #fff;
	min-width: 230px;
	padding: 1.5em 0.8em 0 0.8em;
	box-shadow: 0.5px 0 5px -2px #888;

	@media only screen and (max-width: 992px) {
		display: none;
	}

	.sidebar-collapse-btn{
		position: absolute;
		top: 500px;
		left: 229px;
		background: #fff;
		height: 4em;
		width: 1em;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 100;
		border-radius: 0 30px 30px 0;
	}

	.sidebar-item {
		border-radius: 4px;
		margin: 0 0;
		padding: 0.8em !important;
		cursor: pointer;
		
		&.active {
			background: #E5007A !important;
			color: #fff;
			margin: 0.6em 0;
			
			.header, .icon {
				color: #fff !important;
			}
		}
		
		&:hover {
			background: #eee;
		}

		.icon {
			color: #778192 !important;
		}

		.header {
			color: #778192 !important;
			font-size: 1em;
			font-weight: normal !important;
		}
	}

	.sidebar-heading {
		margin-top: 1em;
		margin-bottom: 0.5em;
		text-align: center;
		font-size: 0.95em;

		.header {
			color: #B9C1CE !important;
			font-weight: 400 !important;
			text-transform: uppercase;
		}
	}
`;