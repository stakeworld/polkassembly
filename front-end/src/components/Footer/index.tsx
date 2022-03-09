// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import * as moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon } from 'semantic-ui-react';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

import logo from '../../assets/polkassembly-logo.png';

interface Props {
	className?: string
}

const Footer = ({ className }:Props ): JSX.Element => {

	const network = getNetwork();
	const links = chainLinks[network];

	return (
		<footer className={className}>
			<Grid stackable className='footer-grid'>
				<Grid.Column width={6}>
					<img alt='Polkassembly Logo' src={logo} />
				</Grid.Column>

				<Grid.Column width={3} className='link-col'>
					<div className='col-heading'> Help Center </div>
					<div className='col-links-container'>
						<Link to="/terms-and-conditions" className='footer-link'>Terms and Conditions</Link>
						<a href="https://github.com/premiurly/polkassembly/issues" className='footer-link'>Report an Issue</a>
					</div>
				</Grid.Column>

				<Grid.Column width={4} className='link-col'>
					<div className='col-heading'> PolkAssembly </div>
					<div className='col-links-container'>
						<Link to="/terms-of-website" className='footer-link'>Terms of Website</Link>
						<Link to="/privacy" className='footer-link'>Privacy Policy</Link>
					</div>
				</Grid.Column>

				<Grid.Column width={3}>
					<div className='col-heading'> Network </div>
					<Grid className='network-link-grid'>
						<Grid.Row className='network-links'>
							<Grid.Column width={4}>
								<a href={links.homepage} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='home' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.twitter} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='twitter' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.discord} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='discord' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.github} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='github' />
								</a>
							</Grid.Column>
						</Grid.Row>

						<Grid.Row className='network-links'>
							<Grid.Column width={4}>
								<a href={links.youtube} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='youtube' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.reddit} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='reddit alien' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.telegram} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='telegram plane' />
								</a>
							</Grid.Column>
							<Grid.Column width={4}>
								<a href={links.blockExplorer} target='_blank' rel='noreferrer' className='network-icon'>
									<Icon size='large' name='cube' />
								</a>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Column>

				<Grid.Row className='copyright-row'>
					<div className='copyright-div'>
						&copy; {moment.utc().year()} Premiurly
					</div>
				</Grid.Row>

			</Grid>

		</footer>
	);
};

export default styled(Footer)`
	position: absolute;
	display: block;
	width: 100vw !important;
	height: fit-content;
	// max-height: 55vh;
	background-color: nav_black;
	font-family: font_default;
	padding: 10vh 5vw;
	color: grey_secondary;
	font-size: 16px;

	.footer-grid {
		width: 90%;
	}

	img {
		width: 100%;
  	height: auto;
		max-width: 289px;
		max-height: 97px;
	}

	.col-heading, .network-icon {
		color: #fff;
	}

	.link-col{
		padding-left: 2em;
		padding-top: 2em;
		margin-top: 1em;
	}

	.col-links-container {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
		a {
			color: grey_secondary !important;
		}
	}

	.network-link-grid {
		margin-top: 16px;
	}

	.footer-link {
		margin-bottom: 0.8em;
	}
	
	.network-links {
		.network-icon {
			border: 1px solid #494949;
			padding: 1em;
			display: flex;
			height: 40px;
			width: 40px;
			align-items: center;
			justify-content: center;
		}
	}

	.copyright-row {
		margin-top: 2em;
		margin-bottom: 0.6em !important;
	}

	.copyright-div {
		position: absolute;
		width: 95vw;
		padding-top: 1em;
		// padding-bottom: 1em;
		border-top: solid 2px #333;
		font-size: 14px !important;
	}
`;
