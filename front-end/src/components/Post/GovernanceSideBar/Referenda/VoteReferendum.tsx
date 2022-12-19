// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import { Button, Form, Modal, Select, Spin } from 'antd';
import BN from 'bn.js';
import React, { useCallback, useContext, useEffect,useMemo,useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { LoadingStatusType,NotificationStatus } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import BalanceInput from 'src/ui-components/BalanceInput';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import queueNotification from 'src/ui-components/QueueNotification';

import AyeNayButtons from '../../../../ui-components/AyeNayButtons';
import QuizForm from './ProofOfChaos/QuizForm';
import WelcomeScreen from './ProofOfChaos/WelcomeScreen';

interface Props {
	className?: string
	referendumId?: number | null | undefined
	address: string
	accounts: InjectedAccount[]
	onAccountChange: (address: string) => void
	getAccounts: () => Promise<undefined>
	lastVote: string | null | undefined
	setLastVote: React.Dispatch<React.SetStateAction<string | null | undefined>>
	isReferendumV2?: boolean
}

const VoteReferendum = ({ className, referendumId, address, accounts, onAccountChange, getAccounts, lastVote, setLastVote, isReferendumV2 }: Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [lockedBalance, setLockedBalance] = useState<BN | undefined>(undefined);
	const [onlyVote, setOnlyVote] = useState<boolean>(false);
	const [quizLevel, setQuizLevel] = useState<Number>(0);
	const [quiz, setQuiz] = useState<any>({});
	const { api, apiReady } = useContext(ApiContext);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message: '' });
	const CONVICTIONS: [number, number][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock]);

	const convictionOpts = useMemo(() => [
		<Select.Option key={0} value={0}>{'0.1x voting balance, no lockup period'}</Select.Option>,
		...CONVICTIONS.map(([value, lock]) =>
			<Select.Option key={value} value={value}>{`${value}x voting balance, locked for ${lock} enactment period(s)`}</Select.Option>
		)
	],[CONVICTIONS]);

	const [conviction, setConviction] = useState<number>(0);

	const onConvictionChange = (value: any) => {
		setConviction(Number(value));
	};

	const onBalanceChange = (balance: BN) => setLockedBalance(balance);

	const fetchQuizData = useCallback(() => {
		// setLoading(true);
		fetch('https://squid.subsquid.io/referenda-dashboard/v/1/graphql',
			{ body: JSON.stringify({
				query: `query QuizzesQuery {
                    quizzes(where: {referendumIndex_eq: ${referendumId}}) {
                      blockNumber
                      creator
                      id
                      referendumIndex
                      timestamp
                      version
                      questions {
                        id
                        quizId
                        text
                        indexCorrectAnswerHistory {
                          blockNumber
                          correctIndex
                          id
                          questionId
                          submitter
                          timestamp
                          version
                        }
                        answerOptions {
                          id
                          questionId
                          text
                        }
                      }
                      submissions {
                        answers {
                          id
                        }
                        blockNumber
                        id
                        quizId
                        referendumIndex
                        timestamp
                        version
                        wallet
                      }
                    }
                  }`
			}),
			headers: {
				'Accept': 'application/json, multipart/mixed',
				'content-type': 'application/json'
				// 'Sec-Fetch-Dest': 'empty',
				// 'Sec-Fetch-Mode': 'cors',
				// 'Sec-Fetch-Site': 'same-origin'
			},
			method: 'POST'
			})
			.then(async (res) => {
				const response = await res.json();
				if(response && response.data && response.data.quizzes) {
					setQuiz(response.data.quizzes[0]);
					console.log(response.data);
				}
			}).catch((err) => {
				console.log(err);
				console.log('Error in fetching voters :', err);
			});
	}, [ referendumId]);

	useEffect(() => {
		fetchQuizData();
	}, [fetchQuizData, referendumId]);

	const voteReferendum = async (aye: boolean) => {
		if (!referendumId && referendumId !== 0) {
			console.error('referendumId not set');
			return;
		}

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });

		let voteTx = null;

		if(isReferendumV2){
			voteTx = api.tx.convictionVoting.vote(referendumId, { Standard: { balance: lockedBalance, vote: { aye, conviction } } });
		}
		else{
			voteTx = api.tx.democracy.vote(referendumId, { Standard: { balance: lockedBalance, vote: { aye, conviction } } });
		}

		voteTx.signAndSend(address, ({ status }) => {
			if (status.isInBlock) {
				setLoadingStatus({ isLoading: false, message: '' });
				queueNotification({
					header: 'Success!',
					message: `Vote on referendum #${referendumId} successful.`,
					status: NotificationStatus.SUCCESS
				});
				setLastVote(aye ? 'aye' : 'nay');
				console.log(`Completed at block hash #${status.asInBlock.toString()}`);
			} else {
				if (status.isBroadcast){
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the vote' });
				}
				console.log(`Current status: ${status.type}`);
			}
		}).catch((error) => {
			setLoadingStatus({ isLoading: false, message: '' });
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			queueNotification({
				header: 'Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		});
	};

	const openModal = (onlyVote: boolean) => {
		setOnlyVote(onlyVote);
		setShowModal(true);
		if(accounts.length === 0) {
			getAccounts();
		}
	};

	const VoteLock = ({ className }: { className?:string }) =>
		<Form.Item className={className}>
			<label  className='mb-3 flex items-center text-sm text-sidebarBlue'>
				Vote lock
				<HelperTooltip className='ml-2' text='You can multiply your votes by locking your tokens for longer periods of time.' />
			</label>

			<Select onChange={onConvictionChange} size='large' className='rounded-md text-sm text-sidebarBlue p-1 w-full' defaultValue={conviction}>
				{convictionOpts}
			</Select>
		</Form.Item>;

	return (
		<div className={className}>
			<Button
				className='bg-pink_primary hover:bg-pink_secondary text-lg mb-3 text-white border-pink_primary hover:border-pink_primary rounded-lg flex items-center justify-center p-7 w-[95%] mx-auto'
				onClick={() => openModal(false)}
			>
				Take Quiz and Vote
			</Button>
			<Button
				type='primary'
				className='rounded-lg mb-6 flex items-center justify-center text-lg p-7 w-[95%] mx-auto'
				onClick={() => openModal(true)}
			>
				{lastVote == null || lastVote == undefined  ? 'Only Cast Vote' : 'Cast Vote Again' }
			</Button>
			<Modal
				open={showModal}
				centered
				onCancel={() => {
					setShowModal(false);
					setQuizLevel(0);
					setOnlyVote(false);
				}}
				footer={null}
			>
				{!onlyVote && quizLevel === 0 ? <WelcomeScreen setQuizLevel={setQuizLevel} />
					: !onlyVote && quizLevel === 1 ? <Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<QuizForm setLoading={setLoadingStatus} quiz={quiz} referendumId={referendumId} setQuizLevel={setQuizLevel}/>
					</Spin>
						: <Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
							{onlyVote && <div className='p-3 mb-7 flex items-center justify-center text-sidebarBlue bg-opacity-10 text-[14px] bg-pink_primary rounded-md'><span>You&apos;re missing on a chance to win an exclusive NFT. Take Quiz Now</span></div>}
							<h4 className='dashboard-heading mb-7'>Cast Your Vote</h4>
							<BalanceInput
								label={'Lock balance'}
								helpText={'Amount of you are willing to lock for this vote.'}
								placeholder={'123'}
								onChange={onBalanceChange}
							/>

							<AccountSelectionForm
								title='Vote with Account'
								accounts={accounts}
								address={address}
								withBalance
								onAccountChange={onAccountChange}
							/>

							<VoteLock className='mt-6' />

							<AyeNayButtons
								className='mt-6 max-w-[156px]'
								size='large'
								disabled={!apiReady}
								onClickAye={() => voteReferendum(true)}
								onClickNay={() => voteReferendum(false)}
							/>

						</Spin> }
			</Modal>
		</div>
	);
};

export default styled(VoteReferendum)`
	.LoaderWrapper {
		height: 40rem;
		position: absolute;
		width: 100%;
	}

	.vote-form-cont {
		padding: 12px;
	}
	
`;
