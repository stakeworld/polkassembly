// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NotificationStatus } from 'src/types';
import { LoadingStatusType } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

import { SendAndFinalize } from './sendAndFinalize';

export async function SubmitQuizAnswers(signer: any, setLoading: (status: LoadingStatusType) => void, ref: any, address: string, userAnswers: any, quizVersion: any, api: any) {

	setLoading({ isLoading: true, message: 'Sending Answers' });

	const promiseFunction =  async (resolve: any, reject: any ) => {
		try {
			const transaction = await getQuizAnswersRemarkTx(api, ref, userAnswers, quizVersion);
			const success = await SendAndFinalize(api, transaction, signer, address);
			queueNotification({
				header: 'Submission Done Successfully!',
				message: 'Your answers are submitted!',
				status: NotificationStatus.SUCCESS
			});
			setLoading({ isLoading: false, message: '' });
			resolve( success );
		} catch( error ) {
			if ( error === 'signAndSend cancelled') {
				queueNotification({
					header: 'Submission failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
				setLoading({ isLoading: false, message: '' });
				reject( 'cancelled' );
			} else {
				setLoading({ isLoading: false, message: '' });
				reject( error );
			}
		}
	};

	return new Promise((resolve, reject) => promiseFunction(resolve, reject));
}

async function getQuizAnswersRemarkTx(api: any, ref: any, userAnswers: any, quizVersion: any) {
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