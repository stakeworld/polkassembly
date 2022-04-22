// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { ReactNode, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Icon, Menu, Responsive } from 'semantic-ui-react';
import NetworkDropdown from 'src/ui-components/NetworkDropdown';
import SearchBar from 'src/ui-components/SearchBar';

import logo from '../../assets/polkassembly-logo.png';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useLogoutMutation } from '../../generated/graphql';
import { useRouter } from '../../hooks';
import { logout } from '../../services/auth.service';
import AddressComponent from '../../ui-components/Address';

interface Props {
	children?: ReactNode
	className?: string
	toggleSidebarHidden: () => void
}

const MenuBar = ({ className, toggleSidebarHidden } : Props): JSX.Element => {
	const currentUser = useContext(UserDetailsContext);
	const [logoutMutation] = useLogoutMutation();
	const { history } = useRouter();
	const { setUserDetailsContextState, username } = currentUser;

	const handleLogout = async () => {
		try {
			await logoutMutation();
		} catch (error) {
			console.error(error);
		}
		logout(setUserDetailsContextState);
		history.push('/');
	};

	const loggedOutItems = [
		{ content:'Login', icon:'sign in', to:'/login' },
		{ content: 'Sign-up', icon:'plus circle', to:'/signup' }
	];

	const loggedInItems = [
		{ content:'Notifications', icon:'bell', to:'/notification-settings' },
		{ content:'Settings', icon:'cog', to:'/settings' },
		{ content:'Tracker', icon:'bookmark', to:'/tracker' },
		{ content:'Logout', icon:'sign-out', onClick: handleLogout, to:'/' }
	];

	const toggleSidebar = () => {
		toggleSidebarHidden();
	};

	const userMenu = currentUser.web3signup && currentUser.defaultAddress
		? <><AddressComponent address={currentUser.defaultAddress} /></>
		: <><Icon size='big' name='user circle' inverted />{username}</>;

	const caretIcon = <Icon name='caret down' inverted />;

	return (
		<>
			<Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
				<Menu className={className} inverted widths={3} id='menubar'>
					<Menu.Menu position="left" className='sidebar-btn'>
						<Icon onClick={toggleSidebar} name="sidebar" size='large' />
					</Menu.Menu>
					<Menu.Item as={NavLink} to="/" className='logo' id='title'><img alt='Polkassembly Logo' src={logo} /></Menu.Item>
					<Menu.Menu position="right">
						<NetworkDropdown />
					</Menu.Menu>
				</Menu>
			</Responsive>

			<Responsive minWidth={Responsive.onlyComputer.minWidth}>
				<Menu className={className} stackable inverted borderless>
					<Menu.Item as={NavLink} to="/" className='logo' id='title'><img alt='Polkassembly Logo' src={logo} /></Menu.Item>
					<Menu.Menu className='right-menu' position="right">

						{username && <Menu.Item title='Create Post' as={NavLink} to="/post/create"><Icon className='create-post-btn' name='add circle' size='large' /></Menu.Item>}

						<SearchBar className='search-bar' />
						<NetworkDropdown />
						{username
							? <>
								<Dropdown className='logged-in-dropdown' trigger={userMenu} icon={caretIcon} item={true}>
									<Dropdown.Menu>
										{loggedInItems.map((item, index) => <Menu.Item as={NavLink} key={index} {...item}/>)}
									</Dropdown.Menu>
								</Dropdown>
							</>
							: <>
								{loggedOutItems.map((item, index) => <Menu.Item as={NavLink} activeClassName="pink_primary-text" className='user_items' key={index} {...item} />)}
							</>
						}
					</Menu.Menu>
				</Menu>
			</Responsive>
		</>
	);
};

export default styled(MenuBar)`
	#title, .item {
		padding-left: 0 !important;
		margin-left: 0 !important;
	}

	.create-post-btn {
		cursor: pointer; 
	}

	.pink_primary-text{
		color: pink_primary !important;
	}

	&.ui.menu, .ui.inverted.menu {
		font-family: font_default;
		background-color: nav_black;
		border-radius: 0rem;
		letter-spacing: 0.2px;

		& a.active {
			outline: none;
			background-color: nav_black !important;
		}
		.item {
			color: grey_secondary;
			font-weight: 500;
			&:hover {
				color: white;
			}
		}

		i.icon {
			color: grey_secondary;
		}

		.logo {
			img {
				width: 16rem;

				@media only screen and (max-width: 992px) {
					width: 10rem;
				}
			}
			background-color: nav_black !important;
		}
	}

	.right-menu {
		display: flex;
		align-items: center;

		.search-bar {
			margin-right: 1em;

			input {
				color: #ddd;
				background: rgba(255, 255, 255, 0.25);
				border-radius: 0.7em !important;
				padding-top: 1em;
				padding-bottom: 1em;
				width: 26rem;
			}

			.results {
				width: 35.5vw !important;
				overflow-y: auto;
				height: 70vh;
			}
		}

		.logged-in-dropdown, i.icon.caret {
			color: #fff !important;
		}
	}

	@media only screen and (max-width: 992px) {
		position: fixed;
		z-index: 400;

		.sidebar-btn {
			margin-left: 20px !important;
			align-items: center;

			.icon {
				cursor: pointer;
			}
		}

		&.pushable {
			position: relative;
		}

		&.ui.menu, .ui.inverted.menu {
			min-height: 5rem;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: grey_primary;
			margin: 0rem!important;

			.desktop_items, #title {
				position: absolute;
			}

			.desktop_items, #title {
				text-align: left;
				margin: auto 0;
				left: 54px;
				top: 0.3rem;
				padding-top: 1rem;
				padding-bottom: 0;
				border-radius: 0.8rem!important;
			}

			#rightmenu {
				font-size: lg;
				max-width: 2rem;
				margin-right: 2rem !important;
				margin-left: 2rem !important;
			}

			.item {
				font-size: md;
				display: inline-block;
				&:before {
					width: 0rem;
				}
			}

			a.item:hover {
				background: none;
				color: grey_secondary;
			}
		}

		.ui.top.sidebar {
			padding: 1rem;
			border-radius: 0rem!important;
			position: relative;
			.item {
				float: left;
				clear: both;
				text-align: left;
				border-radius: 0.8rem!important;
			}
		}

		.ui.icon.menu .item {
			text-align: left;
			padding: 1.5rem 1rem;
			&>.icon:not(.dropdown) {
				font-size: 1.6rem!important;
				display: inline-block;
				margin: 0 1.2rem auto 0 !important;
			}
		}
	}

	@media only screen and (min-width: 992px) {
		&.ui.menu {
			padding: 0.5rem 2rem;
			font-size: md;
			.item {
				padding: 0.5rem 0.5rem;
				margin: 0 1.2rem;
				:hover {
					background-color: nav_black !important;
				}
			}

			.ui.dropdown .menu>.item,
			.ui.dropdown .menu>.active.item {
				font-size: md!important;
				font-weight: 400 !important;
			}
		}

		.desktop_items, .user_items, #title {
			i.icon {
				display: none;
			}
			i.icon.caret {
				display: block;
			}
		}

	}

	&.ui.inverted.menu a.item:hover, &.ui.inverted.menu .dropdown.item:hover {
		border-radius: 0.5rem;
	}
`;
