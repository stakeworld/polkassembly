// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext } from 'react';
import { Button, Divider, Grid } from 'semantic-ui-react';

import { UserDetailsContext } from '../../context/UserDetailsContext';
import Address from './address';
import DeleteAccount from './deleteAccount';
import Email from './email';
import Multisig from './multisig';
import Password from  './password';
import Proxy from './proxy';
import SetCredentials from './setCredentials';
import SetOnChainIdentityButton from './setOnChainIdentityButton';
import Username from './username';

interface Props {
	className?: string
}

const Settings = ({ className }:Props): JSX.Element => {
	const { web3signup } = useContext(UserDetailsContext);

	return (
		<Grid className={className} stackable reversed='mobile tablet'>
			<Grid.Column className='col-left' mobile={16} tablet={12} computer={12} largeScreen={10} widescreen={10}>
				<h2>Settings</h2>
				<Divider/>
				{web3signup ? <SetCredentials /> : <Username/>}
				<Divider/>
				{web3signup ? null : <><Email/><Divider/></>}
				{web3signup ? null : <><Password/><Divider/></>}
				<Address/>
				<Divider/>
				<Multisig/>
				<Divider/>
				<Proxy />
				<Divider />
				<DeleteAccount/>
			</Grid.Column>
			<Grid.Column className='col-right' mobile={16} tablet={16} computer={5} largeScreen={5} widescreen={5}>
				<div className='card-right'>
					<h4>Identity </h4>
					<SetOnChainIdentityButton />

					<Divider className='divider' />

					<h4>Delegate </h4>
					<Button size='huge' disabled>Coming Soon</Button>
				</div>
			</Grid.Column>
		</Grid>
	);
};

export default styled(Settings)`
	.col-right {
		padding-top: 0 !important;
	}

	.card-right {
		background-color: white;
		padding: 2rem 3rem 3rem 3rem!important;
		border-radius: 0.3rem;
		box-shadow: box_shadow_card;
		display: flex;
		justify-content: center;
		flex-direction: column;

		.divider {
			margin-top: 3em;
			margin-bottom: 2em;
		}
		@media only screen and (max-width: 576px) {
			width: 100%;
			border-radius: 0px;
		}
	}

	.col-left{
		background-color: white;
		padding: 2rem 3rem 3rem 3rem!important;
		border-radius: 0.3rem;
		box-shadow: box_shadow_card;

		.ui.divider, .ui.divider:not(.vertical):not(.horizontal) {
			margin: 3rem 0 2rem 0;
			border-top-style: solid;
			border-top-width: 1px;
			border-top-color: grey_light;
			border-bottom: none;
		}

		.button {
			margin-top: 0.2rem;
		}

		.ui.form:not(.unstackable)
		.fields:not(.unstackable)>.ten.wide.field {

			@media only screen and (max-width: 767px)  {
				width: 70%!important;
			}

			@media only screen and (max-width: 576px) {
				width: 60%!important;
			}
		}

		.ui.form:not(.unstackable)
		.fields:not(.unstackable)>.six.wide.field {

			@media only screen and (max-width: 767px)  {
				width: 30%!important;
			}

			@media only screen and (max-width: 576px) {
				width: 40%!important;
			}
		}

		@media only screen and (max-width: 576px) {
			padding: 2rem!important;

			.ui.form {
				margin-top: 0rem;
						padding: 0rem;
			}

			button {
				padding: 0.8rem 1rem;
				border-radius: 0.5rem;
			}
		}
	}
`;
