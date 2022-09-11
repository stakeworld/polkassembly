// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import jwt from 'jsonwebtoken';
import React, { createContext, useState } from 'react';

import { getLocalStorageToken } from '../services/auth.service';
import { JWTPayploadType, Role, UserDetailsContextType } from '../types';
import { decodePostgresArray } from '../util/decodePostgressArray';
import getNetwork from '../util/getNetwork';

const NETWORK = getNetwork();

const initialUserDetailsContext : UserDetailsContextType = {
	addresses: [],
	allowed_roles: [],
	defaultAddress: '',
	email: null,
	email_verified: false,
	id: null,
	notification: {
		newProposal: false,
		ownProposal: true,
		postCreated: true,
		postParticipated: true
	},
	picture: null,
	setUserDetailsContextState : (): void => {
		throw new Error('setUserDetailsContextState function must be overridden');
	},
	username: null,
	web3signup: false
};

const accessToken = getLocalStorageToken();
try {
	const tokenPayload: any = accessToken && jwt.decode(accessToken);

	if (tokenPayload && tokenPayload.sub) {
		const {
			sub: id,
			username,
			email,
			email_verified,
			notification,
			'https://hasura.io/jwt/claims': claims,
			web3signup
		} = tokenPayload as JWTPayploadType;

		if (id) {
			initialUserDetailsContext.id = Number(id);
		}
		if (username) {
			initialUserDetailsContext.username = username;
		}
		if (email) {
			initialUserDetailsContext.email = email;
		}
		if (notification) {
			initialUserDetailsContext.notification = notification;
		}
		initialUserDetailsContext.email_verified = email_verified || false;

		initialUserDetailsContext.addresses = decodePostgresArray('{1hCMdtRsaRA4ZTEKpPKPvEjK9rZpGhyFnRHSDhqFMCEayRL}');
		initialUserDetailsContext.defaultAddress = '1hCMdtRsaRA4ZTEKpPKPvEjK9rZpGhyFnRHSDhqFMCEayRL';
		initialUserDetailsContext.allowed_roles = ['admin'];
		initialUserDetailsContext.web3signup = web3signup || false;

		console.log(initialUserDetailsContext.addresses);
		console.log(initialUserDetailsContext.defaultAddress);
	}
} catch {
	//do nothing, the user will be authenticated as soon as there's a new call to the server.
}

export const UserDetailsContext = createContext(initialUserDetailsContext);

export const UserDetailsProvider = ({ children }: React.PropsWithChildren<{}>) => {

	const [userDetailsContextState, setUserDetailsContextState] = useState(initialUserDetailsContext);

	return (
		<UserDetailsContext.Provider value={{ ...userDetailsContextState, setUserDetailsContextState }}>
			{children}
		</UserDetailsContext.Provider>
	);
};
