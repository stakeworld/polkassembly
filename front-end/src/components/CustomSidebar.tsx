// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useState } from 'react';
import { Icon, List } from 'semantic-ui-react';

const CustomSidebar = ({ className } : { className?: string }): JSX.Element => {
	const [activeRoute] = useState<string>('/');

	const SidebarItems = [
		{
			icon: <Icon name='th' />,
			link: '/',
			name: 'Overview'
		},
		{
			icon: <Icon name='home' />,
			link: '/discussions',
			name: 'Discussions'
		},
		{
			icon: <Icon name='home' />,
			link: '/calendar',
			name: 'Calendar'
		},
		{
			icon: <Icon name='home' />,
			link: '/news',
			name: 'News'
		}
	];

	const TreasuryItems = [
		{
			icon: <Icon name='th' />,
			link: '/treasury-proposals',
			name: 'Proposals'
		},
		{
			icon: <Icon name='home' />,
			link: '/bounties',
			name: 'Bounties'
		},
		{
			icon: <Icon name='home' />,
			link: '/tips',
			name: 'Tips'
		}
	];

	const DemocracyItems = [
		{
			icon: <Icon name='th' />,
			link: '/proposals',
			name: 'Proposals'
		},
		{
			icon: <Icon name='home' />,
			link: '/referenda',
			name: 'Referenda'
		}
	];

	const CouncilItems = [
		{
			icon: <Icon name='th' />,
			link: '/bv',
			name: 'Motions'
		},
		{
			icon: <Icon name='home' />,
			link: '/a',
			name: 'Members'
		}
	];

	const TechCommItems = [
		{
			icon: <Icon name='th' />,
			link: '/bv',
			name: 'Proposals'
		},
		{
			icon: <Icon name='home' />,
			link: '/a',
			name: 'Members'
		}
	];

	const FinancialCouncilItems = [
		{
			icon: <Icon name='th' />,
			link: '/bv',
			name: 'Motions'
		},
		{
			icon: <Icon name='home' />,
			link: '/a',
			name: 'Members'
		}
	];

	return (
		<>
			<div className={className}>
				<div className="sidebar-parent">
					<List size='large' verticalAlign='middle'>
						{
							SidebarItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Treasury */}
						<List.Item className='sidebar-heading'>
							<List.Content>
								<List.Header>Treasury</List.Header>
							</List.Content>
						</List.Item>
						{
							TreasuryItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Democracy */}
						<List.Item className='sidebar-heading'>
							<List.Content>
								<List.Header>Democracy</List.Header>
							</List.Content>
						</List.Item>
						{
							DemocracyItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* Council */}
						<List.Item className='sidebar-heading'>
							<List.Content>
								<List.Header>Council</List.Header>
							</List.Content>
						</List.Item>
						{
							CouncilItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* TechComm */}
						<List.Item className='sidebar-heading'>
							<List.Content>
								<List.Header>Tech. Comm.</List.Header>
							</List.Content>
						</List.Item>
						{
							TechCommItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
										<List.Header>{item.name}</List.Header>
									</List.Content>
								</List.Item>
							))
						}

						{/* FinancialCouncil */}
						<List.Item className='sidebar-heading'>
							<List.Content>
								<List.Header>Financial Council</List.Header>
							</List.Content>
						</List.Item>
						{
							FinancialCouncilItems.map(item => (
								<List.Item key={item.name} className={`sidebar-item ${activeRoute == item.link ? 'active' : ''}`}>
									{item.icon}
									<List.Content>
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
	width: 230px;
	padding: 1.5em 0.8em 0 0.8em;
	box-shadow: 0.5px 0 5px -2px #888;

	.sidebar-item {
		border-radius: 4px;
		margin: 0 0;
		padding: 0.8em !important;
		
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