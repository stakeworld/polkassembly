// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

import { SendAndFinalize } from './sendAndFinalize';

export async function SubmitQuizAnswers(signer: any, ref: any, address: string, userAnswers: any, quizVersion: any, api: any) {

	const promiseFunction =  async (resolve: any, reject: any ) => {
		try {
			console.log('in submit quiz promise func', address, signer);
			const transaction = await getQuizAnswersRemarkTx(api, ref, userAnswers, quizVersion);
			const { success } = await SendAndFinalize(api, transaction, signer, address);
			resolve( success );
		} catch( error ) {
			if ( error === 'signAndSend cancelled') {
				queueNotification({
					header: 'Voting failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
				reject( 'cancelled' );
			} else {
				reject( error );
			}
		}
	};

	return new Promise((resolve, reject) => promiseFunction(resolve, reject));
}

async function getQuizAnswersRemarkTx(api: any, ref: any, userAnswers: any, quizVersion: any) {
	console.log('in getQuizAnswers');
	const answerArray: any = [];
	const answerObject = {
		answers: null,
		quizVersion: null
	};
	for (const answerOptions in userAnswers.answers) {
		userAnswers.answers[answerOptions].forEach((answer: any, index: any) => {
			if (answer) {
				answerArray.push(index);
			}
		});
	}
	answerObject.answers = answerArray;
	answerObject.quizVersion = quizVersion;
	return api.tx.system.remark('PROOFOFCHAOS::' + ref + '::ANSWERS::' + JSON.stringify(answerObject));
}