// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { gql } from 'apollo-server-express';

import addProfile from './mutation/addProfile';
import addressLinkConfirm from './mutation/addressLinkConfirm';
import addressLinkStart from './mutation/addressLinkStart';
import addressLogin from './mutation/addressLogin';
import addressLoginStart from './mutation/addressLoginStart';
import addressSignupConfirm from './mutation/addressSignupConfirm';
import addressSignupStart from './mutation/addressSignupStart';
import addressUnlink from './mutation/addressUnlink';
import changeAbout from './mutation/changeAbout';
import changeEmailMutation from './mutation/changeEmail';
import changeNotificationPreference from './mutation/changeNotificationPreference';
import changePasswordMutation from './mutation/changePassword';
import changeUsernameMutation from './mutation/changeUsername';
import createPostConfirm from './mutation/createPostConfirm';
import createPostStart from './mutation/createPostStart';
import createProposalTracker from './mutation/createProposalTracker';
import deleteAccount from './mutation/deleteAccount';
import editPostConfirm from './mutation/editPostConfirm';
import editPostStart from './mutation/editPostStart';
import loginMutation from './mutation/login';
import logoutMutation from './mutation/logout';
import multisigLinkConfirm from './mutation/multisigLinkConfirm';
import multisigLinkStart from './mutation/multisigLinkStart';
import postSubscribe from './mutation/postSubscribe';
import postUnsubscribe from './mutation/postUnsubscribe';
import reportContent from './mutation/reportContent';
import requestResetPassword from './mutation/requestResetPassword';
import resendVerifyEmailToken from './mutation/resendVerifyEmailToken';
import resetPassword from './mutation/resetPassword';
import setCredentialsConfirm from './mutation/setCredentialsConfirm';
import setCredentialsStart from './mutation/setCredentialsStart';
import setDefaultAddress from './mutation/setDefaultAddress';
import signupMutation from './mutation/signup';
import undoEmailChange from './mutation/undoEmailChange';
import updateProposalTracker from './mutation/updateProposalTracker';
import verifyEmail from './mutation/verifyEmail';
import aboutQuery from './query/about';
import profileQuery from './query/profile';
import subscription from './query/subscription';
import tokenQuery from './query/token';
import userQuery from './query/user';
import userDetailsQuery from './query/userDetails';
import userWithUsername from './query/userWithUsername';
import about from './type/about';
import address from './type/address';
import addressLinkType from './type/addressLinkType';
import addressLoginType from './type/addressLoginType';
import changeResponseType from './type/changeResponse';
import loginResponseType from './type/loginResponse';
import messageType from './type/message';
import notificationPreferencesType from './type/notificationPreferences';
import notificationPreferencesInput from './type/notificationPreferencesInput';
import profile from './type/profile';
import publicUser from './type/publicUser';
import subscriptionType from './type/subscription';
import tokenType from './type/token';
import undoEmailChangeResponse from './type/undoEmailChangeResponse';
import userType from './type/user';

export default gql`
	${about}
	${address}
	${addressLinkType}
	${addressLoginType}
	${changeResponseType}
	${loginResponseType}
	${messageType}
	${notificationPreferencesType}
	${notificationPreferencesInput}
	${publicUser}
	${subscriptionType}
	${tokenType}
	${undoEmailChangeResponse}
	${userType}
	${profile}

	type Query {
		${aboutQuery}
		${profileQuery}
		${subscription}
		${tokenQuery}
		${userQuery}
		${userDetailsQuery}
		${userWithUsername}
	}

	type Mutation {
		${addProfile}
		${addressLinkConfirm}
		${addressLinkStart}
		${addressLogin}
		${addressLoginStart}
		${addressSignupConfirm}
		${addressSignupStart}
		${addressUnlink}
		${changeAbout}
		${changeUsernameMutation}
		${changeEmailMutation}
		${changePasswordMutation}
		${changeNotificationPreference}
		${createPostConfirm}
		${createPostStart}
		${createProposalTracker}
		${editPostConfirm}
		${editPostStart}
		${deleteAccount}
		${loginMutation}
		${logoutMutation}
		${multisigLinkConfirm}
		${multisigLinkStart}
		${postSubscribe}
		${postUnsubscribe}
		${reportContent}
		${requestResetPassword}
		${resendVerifyEmailToken}
		${resetPassword}
		${setCredentialsConfirm}
		${setCredentialsStart}
		${setDefaultAddress}
		${signupMutation}
		${undoEmailChange}
		${updateProposalTracker}
		${verifyEmail}
	}
`;
