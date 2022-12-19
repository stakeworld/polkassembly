// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { Button, Form, Radio } from 'antd';
import React, { useContext, useEffect,useState } from 'react';
import ExtensionNotDetected from 'src/components/ExtensionNotDetected';
import { ApiContext } from 'src/context/ApiContext';
import { useGetAllAccounts } from 'src/hooks';
import ErrorAlert from 'src/ui-components/ErrorAlert';

import { SubmitQuizAnswers } from './data/quiz-service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuizForm = ({ className, quiz, referendumId, setLoading, setQuizLevel }: { className?: string, referendumId: Number | null | undefined, quiz: any, setLoading: any, setQuizLevel: (level: Number) => void }) => {

	const { accounts, accountsMap, noAccounts, noExtension, signersMap } = useGetAllAccounts();

	const { api, apiReady } = useContext(ApiContext);

	const [userAnswers, setUserAnswers] = useState<any>({});
	const [address, setAddress] = useState<string>('');
	const [signer, setSigner] = useState<Signer>();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const signer: Signer = signersMap[accountsMap[address]];
		setSigner(signer);
	}, [accountsMap, address, api, apiReady, signersMap]);

	useEffect(() => {
		if(!accounts || accounts.length === 0 ) return;
		setAddress(accounts[0].address);
	}, [accounts]);

	const onSend = async () => {
		try{
			await form.validateFields();
		}catch(e){
			console.log(e);
			return;
		}
		setLoading({ isLoading: true, message: 'Sending Answers' });
		SubmitQuizAnswers(signer, referendumId, address, userAnswers.quizAnswers[`${referendumId}`], quiz.version, api).then(
			() => {
				setQuizLevel(2);
				setUserAnswers((state: any) => ({
					...state,
					quizAnswers: {
						...state.quizAnswers,
						[`${referendumId}`]: {
							...state.quizAnswers[`${referendumId}`],
							submitted: true,
							submittedOn: Date.now()
						}
					}
				}));
				setLoading({ isLoading: false, message: '' });
			}
		);
	};

	function onChangeInputs( e: any, questionIndex: Number, options: Number ) {
		console.log(e.target.value);
		const qAnswer: any = [];
		console.log(options);
		Array(options).fill(0).forEach((_, i) => {
			const ans = i === e.target.value ? true : false;
			qAnswer.push(ans);
		});
		const newUserAnswers = {
			[`${ questionIndex }`]: qAnswer
		};
		setUserAnswers((state: any) => ({
			...state,
			quizAnswers: {
				...state.quizAnswers,
				[`${referendumId}`]: {
					answers: state.quizAnswers ? {
						...state.quizAnswers[`${referendumId}`]?.answers,
						...newUserAnswers
					}: { ...newUserAnswers },
					lastChange: Date.now()
				}
			}
		}));
		console.log(userAnswers);
	}

	return (
		<div className={className}>
			<h4 className='dashboard-heading mb-7'>Take Quiz and Vote</h4>
			{noAccounts && <ErrorAlert errorMsg='You need at least one account in your wallet extenstion to use this feature.' />}
			{noExtension && <ExtensionNotDetected />}
			{!noAccounts && !noExtension &&
						<Form form={form} className='max-h-full overflow-y-auto' onFinish={onSend}>
							{quiz?.questions?.map(( { text, answerOptions }: { text: string, answerOptions: Array<any> }, i:any) => {
								const selectOptions = answerOptions?.map( (a,j) => {
									return {
										label: <div className='text-sidebarBlue font-medium hover:text-pink_primary duration-300 transition-colors'>{a.text}</div>,
										value: j
									// bind the checked value of the inputs to state values
									// checked: userAnswers?.answers?.[i] && userAnswers?.answers?.[i][j]
									};
								});
								return (
									<>
										<div className='text-sidebarBlue font-medium text-[14px] mb-2'>{`Q${i + 1})`} {text}</div>
										<Form.Item name='radio' rules={[{ required: true }]}>
											<Radio.Group className='w-full' onChange={(e) => onChangeInputs(e, i, selectOptions.length)}>
												{selectOptions.map((option) => (
													<div key={option.value} className='border-[1px] border-solid border-grey_border rounded-md mb-2 px-2 py-1 w-full'>
														<Radio name={ `ref${referendumId}question${i}` } value={option.value}>{option.label}</Radio>
													</div>
												))}
											</Radio.Group>
										</Form.Item>
									</>

								);
							})}
							<div className='flex justify-end'>
								<Button htmlType='submit' className='bg-pink_primary hover:bg-pink_secondary text-white border-pink_primary hover:border-pink_primary rounded-md'>Next</Button>
							</div>
						</Form>
			}
		</div>
	);
};

export default QuizForm;