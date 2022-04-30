// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Icon } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

import logo from '../../assets/polkassembly-logo.png';

const Footer = ({ className }:{ className?: string } ): JSX.Element => {

	const network = getNetwork();
	const links = chainLinks[network];

	const year = new Date().getFullYear();

	const siteLinks = <>
		<div className="help-center-links">
			<h3>Help Center</h3>
			<div className='flex-col'>
				<Link to="/terms-and-conditions" className='footer-link'>Terms and Conditions</Link>
				<a href="https://github.com/premiurly/polkassembly/issues" target='_blank' rel='noreferrer' className='footer-link'>Report an Issue</a>
			</div>
		</div>
		<div className="pa-links">
			<h3>Polkassembly</h3>
			<div className='flex-col'>
				<Link to="/terms-of-website" className='footer-link'>Terms of Website</Link>
				<Link to="/privacy" className='footer-link'>Privacy Policy</Link>
			</div>
		</div>
	</>;

	return (
		<footer className={className}>
			<div className="flex">
				<div className="logo">
					<img alt='Polkassembly Logo' className='logo-img' src={logo} />
				</div>

				<div className="mobile-site-links">
					{siteLinks}
				</div>

				{ siteLinks }

				<div className="network-links">
					<h3>Network Links</h3>
					<div className='network-links-container'>
						<div className="network-row">
							<a href={links.homepage} target='_blank' rel='noreferrer' className='network-icon first-network-icon'>
								<Icon name='home' />
							</a>
							<a href={links.twitter} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='twitter' />
							</a>
							<a href={links.discord} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='discord' />
							</a>
							<a href={links.github} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='github' />
							</a>
						</div>

						<div className="network-row">
							<a href={links.youtube} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='youtube' />
							</a>
							<a href={links.reddit} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='reddit alien' />
							</a>
							<a href={links.telegram} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='telegram plane' />
							</a>
							<a href={links.blockExplorer} target='_blank' rel='noreferrer' className='network-icon'>
								<Icon name='cube' />
							</a>
						</div>
					</div>
				</div>
			</div>

			<Divider />

			<div className='copy-year'>
				&copy; Premiurly {year}
			</div>
		</footer>
	);
};

export default styled(Footer)`
	width: 100vw !important;
	background-color: nav_black;
	font-family: font_default;
	color: grey_secondary;
	font-size: 16px;
	padding: 35px 74px;

	@media only screen and (max-width: 992px) {
		padding: 25px 20px;
	}

	
	
	.flex {
		width: 90%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 50px;

		@media only screen and (max-width: 992px) {
			flex-direction: column;
			width: 100%;
			margin-bottom: 15px;


			& > .help-center-links, & > .pa-links {
				display: none;
			}
		}

		.mobile-site-links {
			display: none;
			
			@media only screen and (max-width: 992px) {
				max-width: 500px;
				display: flex;
				justify-content: space-between;
			}
		}

		.logo-img {
			width: 250px;
			max-width: 289px;
			height: auto;

			@media only screen and (max-width: 992px) {
				width: 168px;
				margin-bottom: 26px;
			}
		}

		h3 {
			color: #FFFFFF;
			font-size: 16px;
			margin-bottom: 16px;
		}

		.network-links {
			@media only screen and (max-width: 992px) {
				margin-top: 40px;

				.network-links-container {
					display: flex;
				}
			}

			.network-row {
				display: flex;
				margin-bottom: 16px;

				.network-icon {
					margin: 0 4px;
					border: 1px solid #494949;
					color: #fff;
					padding: 1em;
					display: flex;
					height: 36px;
					width: 36px;
					align-items: center;
					justify-content: center;

					@media only screen and (max-width: 992px) {
						border: none;
						&:not(.first-network-icon) { 
							border-left: 1px solid #494949;
							padding-left: 12px;
						}

						&.first-network-icon {
							padding-left: 0;
							margin-left: -6px;
						}

						padding-right: 0;
						
					}

					@media only screen and (max-width: 362px) {
						&:not(.first-network-icon) { 
							padding: 1px;
							margin: 0;
						}
					}
				}
			}
		}

		/* .site-links {
			display: flex;
			& > * {
				margin-right: 2em;
			}
		} */
	}

	.flex-col {
		display: flex;
		flex-direction: column;

		a {
			color: #ACACAC;
			font-size: 16px;
			margin-bottom: 8px;
		}
	}

	.copy-year {
		margin-top: 20px;
	}

`;
