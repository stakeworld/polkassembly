// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import { Button, Form, Modal, Select, Spin } from 'antd';
import BN from 'bn.js';
import React, { useCallback, useContext,useEffect,useMemo,useState } from 'react';
import frowningFace from 'src/assets/frowning-face.png';
import VoteSuccessful from 'src/assets/lottie-graphics/VoteSuccessful';
import { ApiContext } from 'src/context/ApiContext';
import { subsquidApiHeaders } from 'src/global/apiHeaders';
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
	const [voteComplete, setVoteComplete] = useState<boolean>(false);
	const [submitQuizAddress, setSubmitQuizAddress] = useState<string>(address);
	const { api, apiReady } = useContext(ApiContext);
	const [hasUserSubmitted, setHasUserSubmitted] = useState<boolean>(false);
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
			headers: subsquidApiHeaders,
			method: 'POST'
			})
			.then(async (res) => {
				const response = await res.json();
				if(response && response.data && response.data.quizzes) {
					setQuiz(response.data.quizzes[0]);
				}
				const hasSubmitted = response.data.quizzes[0]?.submissions ? response.data.quizzes[0]?.submissions.some((e: any) => e.wallet === address) : false;
				setHasUserSubmitted(hasSubmitted);
				console.log(response.data.quizzes[0]);
			}).catch((err) => {
				console.log(err);
				console.log('Error in fetching voters :', err);
			});
	}, [address, referendumId]);

	useEffect(() => {
		fetchQuizData();
	}, [ fetchQuizData, referendumId]);

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
				setVoteComplete(true);
			} else {
				if (status.isBroadcast){
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the vote' });
				}
				console.log(`Current status: ${status.type}`);
			}
		}).catch((error) => {
			setLoadingStatus({ isLoading: false, message: '' });
			console.log(':( transaction failed');
			setVoteComplete(false);
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
			{quiz?.questions &&
				<Button
					className='bg-pink_primary hover:bg-pink_secondary text-lg mb-3 text-white border-pink_primary hover:border-pink_primary rounded-lg flex items-center justify-center p-7 w-[95%] mx-auto'
					onClick={() => openModal(false)}
				>
					{hasUserSubmitted ? 'Submit Quiz Again' : 'Take Quiz and Vote'}
				</Button>}
			<Button
				className={`rounded-lg mb-6 flex items-center justify-center text-lg p-7 w-[95%] mx-auto ${!quiz?.questions ? 'bg-pink_primary hover:bg-pink_secondary text-white border-pink_primary hover:border-pink_primary' : 'border-pink_primary text-pink_primary hover:bg-pink_primary hover:text-white'}`}
				onClick={() => openModal(true)}
			>
				{lastVote == null || lastVote == undefined  ? quiz?.questions ? 'Only Cast Vote' : 'Cast Vote' : 'Cast Vote Again' }
			</Button>
			<Modal
				open={showModal}
				centered
				onCancel={() => {
					setShowModal(false);
					setQuizLevel(0);
					setOnlyVote(false);
					setVoteComplete(false);
					setLoadingStatus({ isLoading: false, message: '' });
				}}
				footer={null}
				width={600}
			>
				{!onlyVote && quizLevel === 0 ? <WelcomeScreen setQuizLevel={setQuizLevel} />
					: !onlyVote && quizLevel === 1 ?
						<QuizForm
							setSubmitQuizAddress={setSubmitQuizAddress}
							accounts={accounts}
							address={address}
							onAccountChange={onAccountChange}
							loading={loadingStatus.isLoading}
							setLoading={setLoadingStatus}
							quiz={quiz}
							referendumId={referendumId}
							setQuizLevel={setQuizLevel}
						/>
						: voteComplete ? <VoteSuccessful message={`Vote on Referendum #${referendumId} is successful.`} />
							: <Spin tip={loadingStatus.message} spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
								{onlyVote && quiz?.questions && <div className='p-3 mb-7 flex items-center justify-center text-sidebarBlue bg-opacity-10 text-[14px] bg-pink_primary rounded-md'><img src={frowningFace} height={25} width={25} className='mr-2' alt='frowning-face' /><span> You&apos;re missing on a chance to win an exclusive NFT. <span className='text-pink_primary underline cursor-pointer' onClick={() => { setQuizLevel(0); setOnlyVote(false); }}>Take Quiz Now</span></span></div>}
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
								{submitQuizAddress !== address && !onlyVote ? <div className='font-medium text-red_primary'>The NFT reward will be sent only if quiz and voter wallet address are the same.</div> : null}

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
