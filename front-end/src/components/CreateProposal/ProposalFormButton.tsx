// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import styled from '@xstyled/styled-components';
import React, {  useContext, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { Button, Dropdown, Form, Grid, Icon, Input, Message, Modal } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { NotificationContext } from 'src/context/NotificationContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddPolkassemblyProposalMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { LoadingStatusType, NotificationStatus } from 'src/types';
import Card from 'src/ui-components/Card';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import getEncodedAddress from 'src/util/getEncodedAddress';

import { PolkassemblyProposalTypes } from '../../types';
import AddressComponent from '../../ui-components/Address';
import ContentForm from '../ContentForm';
import TitleForm from '../TitleForm';
interface Props {
	className?: string
	setTipModalOpen: React.Dispatch<React.SetStateAction<boolean>>
	proposalType?: string
}

enum AvailableAccountsInput {
	submitWithAccount,
	beneficiary
}

const ProposalFormButton = ({ className, setTipModalOpen, proposalType } : Props) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [showAvailableAccountsObj, setShowAvailableAccountsObj] = useState<{ [key: string]: boolean}>({
		'beneficiary': false,
		'submitWithAccount': false
	});

	const [submitWithAccount, setSubmitWithAccount] = useState<string>('');
	const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
	const [value, setValue] = useState<string>('');
	const [valueUnit, setValueUnit] = useState<string>('DOT');
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDescription, setPostDescription] = useState<string>('');
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });
	const { queueNotification } = useContext(NotificationContext);
	const [addPolkassemblyProposalMutation] = useAddPolkassemblyProposalMutation();

	const { control, errors, handleSubmit } = useForm();

	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	// const {  } = useContext(UserDetailsContext); #TODO check if !not web3 login or not default address if true return error with web3 login required
	// set authorid from UserDetailsContext
	const { id, web3signup, addresses  }  = useContext(UserDetailsContext);
	console.log('user_id:', id, 'web3sign:', web3signup, addresses);
	const authorId = id || 1;

	const valueUnitOptions = [
		{ key: 'nano', text: 'nano', value: 'nano' },
		{ key: 'micro', text: 'micro', value: 'micro' },
		{ key: 'DOT', text: 'DOT', value: 'DOT' },
		{ key: 'Kilo', text: 'Kilo', value: 'Kilo' },
		{ key: 'Mill', text: 'Mill', value: 'Mill' },
		{ key: 'Bill', text: 'Bill', value: 'Bill' },
		{ key: 'Tril', text: 'Tril', value: 'Tril' },
		{ key: 'Peta', text: 'Peta', value: 'Peta' },
		{ key: 'Exa', text: 'Exa', value: 'Exa' },
		{ key: 'Zeta', text: 'Zeta', value: 'Zeta' },
		{ key: 'Yotta', text: 'Yotta', value: 'Yotta' }
	];

	const handleDetect = async (updateForInput: AvailableAccountsInput) => {
		const extensions = await web3Enable(APPNAME);
		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const allAccounts = await web3Accounts();
		setAvailableAccounts(allAccounts);

		const availableAccountsObj : { [key: string]: boolean } = {
			'beneficiary': false,
			'submitWithAccount': false
		};

		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			availableAccountsObj.submitWithAccount = !showAvailableAccountsObj['submitWithAccount'];
			break;
		case AvailableAccountsInput.beneficiary:
			availableAccountsObj.beneficiary = !showAvailableAccountsObj['beneficiary'];
			break;
		}

		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const isSelected = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			return submitWithAccount === address;
		case AvailableAccountsInput.beneficiary:
			return beneficiaryAccount === address;
		}
	};

	const handleSelectAvailableAccount = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			setSubmitWithAccount(address);
			break;
		case AvailableAccountsInput.beneficiary:
			setBeneficiaryAccount(address);
		}

		// Close dropdown on select
		const availableAccountsObj : { [key: string]: boolean } = {
			'beneficiary': false,
			'submitWithAccount': false
		};
		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const getAvailableAccounts = (updateForInput: AvailableAccountsInput) => {
		return (
			<Form.Group className='availableAccountsForm'>
				<Form.Field width={16}>
					{availableAccounts.map(account => {
						const address = getEncodedAddress(account.address);

						return address &&
							<div key={address} onClick={() => handleSelectAvailableAccount(updateForInput, address)} className='availableAddressItem'>
								<div className='item'>
									<AddressComponent className='item' address={address} extensionName={account.meta.name} />
								</div>
								{isSelected(updateForInput, address) ? <Icon name='check circle' /> : <Icon name='circle outline' />}
							</div>;
					})}
				</Form.Field>
			</Form.Group>
		);
	};

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>[]) => {setPostTitle(event[0].currentTarget.value); return event[0].currentTarget.value;};
	const onPostDescriptionChange = (data: Array<string>) => {setPostDescription(data[0]); return data[0].length ? data[0] : null;};

	const isFormValid = () => {
		const errorsFound: string[] = [];

		if(!beneficiaryAccount){
			errorsFound.push('beneficiaryAccount');
		}
		if(!submitWithAccount){
			errorsFound.push('submitWithAccount');
		}
		if(!value){
			errorsFound.push('value');
		}

		if(errorsFound.length > 0){
			setErrorsFound(errorsFound);
			return false;
		}else{
			setErrorsFound([]);
		}

		return true;
	};
	const { api, apiReady } = useContext(ApiContext);

	const saveProposal = async (authorId: number, proposalType: number, title: string, content: string, proposalHash: string, proposerAddress: string) => {

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const proposalId: number = (await api.query.treasury.proposalCount()).toNumber() - 1;

		addPolkassemblyProposalMutation({ variables: { authorId, content, proposalHash, proposalId, proposalType, proposerAddress, title } }).catch((e) => console.error('Error creating to proposal',e));
	};

	const handleSignAndSubmit = async () => {

		if(!isFormValid()) return;

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		console.log('valueUnit', valueUnit);

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });
		const proposal = api.tx.treasury.proposeSpend(value, beneficiaryAccount);
		proposal.signAndSend(submitWithAccount, ({ status }) => {
			if (status.isInBlock) {
				queueNotification({
					header: 'Success!',
					message: `Propsal #${proposal.hash} successful.`,
					status: NotificationStatus.SUCCESS
				});
				setLoadingStatus({ isLoading: false, message: '' });
				console.log(`Completed at block hash #${status.asInBlock.toString()}`);
				setModalOpen(false);
				saveProposal(authorId, PolkassemblyProposalTypes.TreasurySpendProposal, postTitle, postDescription, proposal.hash.toString(), submitWithAccount);
			} else {
				if (status.isBroadcast){
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the endorsement' });
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

	return (
		loadingStatus.isLoading ?
			<Card className={'LoaderWrapper'}>
				<Loader text={loadingStatus.message}/>
			</Card>
			:
			<Modal
				className={className}
				closeOnEscape={false}
				closeOnDimmerClick={false}
				onClose={() => setModalOpen(false)}
				onOpen={() => setModalOpen(true)}
				open={modalOpen}
				size='small'
				trigger={<Button size='big' style={ { backgroundColor: 'transparent', color: '#333', textDecoration: 'underline' } }> Or proceed manually</Button>}
			>
				<Modal.Header className='text-center modal-header'>
				Create {proposalType} Proposal
				</Modal.Header>
				<Modal.Content scrolling>
					<Modal.Description className='modal-desc'>
						<Grid centered stackable verticalAlign='middle' reversed='mobile tablet'>
							<Grid.Column mobile={13} tablet={13} computer={12}>
								<Form>
									<h5>Enter On-chain Data</h5>

									<div className='topMargin'>
										{/* Submit with account */}
										<Form.Group>
											<Form.Field width={16}>
												<label className='input-label'>
													Submit with account
													<HelperTooltip content='This account will make the proposal and be responsible for the bond.' />
												</label>

												<div className='accountInputDiv'>
													<Identicon
														className='identicon'
														value={submitWithAccount}
														size={26}
														theme={'polkadot'}
													/>
													<Input
														size='big'
														value={submitWithAccount}
														onChange={ (e) => setSubmitWithAccount(e.target.value)}
														placeholder='Account Address'
														error={errorsFound.includes('submitWithAccount')}
													/>
												</div>

												{!extensionNotAvailable && <div className='availableAddressOptions'>
													<div onClick={() => handleDetect(AvailableAccountsInput.submitWithAccount)} className='availableAddressToggle'>
														or choose from available addresses
														{showAvailableAccountsObj['submitWithAccount'] ? <Icon name='chevron up' /> : <Icon name='chevron down' />}
													</div>
												</div>}
												{extensionNotAvailable && <div className="error">Please install polkadot.js extension</div>}
												{showAvailableAccountsObj['submitWithAccount'] && availableAccounts.length > 0 && getAvailableAccounts(AvailableAccountsInput.submitWithAccount)}
											</Form.Field>
										</Form.Group>

										{/* Beneficiary account */}
										<Form.Group>
											<Form.Field width={16}>
												<label className='input-label'>
													Beneficiary Account
													<HelperTooltip content='The beneficiary will receive the full amount if the proposal passes.' />
												</label>

												<div className='accountInputDiv'>
													<Identicon
														className='identicon'
														value={beneficiaryAccount}
														size={26}
														theme={'polkadot'}
													/>
													<Input
														size='big'
														value={beneficiaryAccount}
														onChange={ (e) => setBeneficiaryAccount(e.target.value)}
														placeholder='Account Address'
														error={errorsFound.includes('beneficiaryAccount')}
													/>
												</div>

												{!extensionNotAvailable && <div className='availableAddressOptions'>
													<div onClick={() => handleDetect(AvailableAccountsInput.beneficiary)} className='availableAddressToggle'>
														or choose from available addresses
														{showAvailableAccountsObj['beneficiary'] ? <Icon name='chevron up' /> : <Icon name='chevron down' />}
													</div>
												</div>}
												{extensionNotAvailable && <div className="error">Please install polkadot.js extension</div>}
												{showAvailableAccountsObj['beneficiary'] && availableAccounts.length > 0 && getAvailableAccounts(AvailableAccountsInput.beneficiary)}
											</Form.Field>
										</Form.Group>

										{/* Value */}
										<Form.Group>
											<Form.Field width={16} className='input-form-field'>
												<label className='input-label'>
													Value
													<HelperTooltip content='The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.' />
												</label>

												<Input
													label={ <Dropdown defaultValue='DOT' options={valueUnitOptions} onChange={(event, { value }) => setValueUnit(value as string)} />}
													labelPosition='right'
													type='number'
													min='1'
													placeholder='0'
													className='text-input'
													size='big'
													onChange={ (e) => setValue(e.target.value as string)}
													error={errorsFound.includes('value')}
												/>
											</Form.Field>
										</Form.Group>

										{/* Proposal Bond */}
										<Form.Group>
											<Form.Field width={16} className='input-form-field'>
												<label className='input-label'>
													Proposal Bond
													<HelperTooltip content='Of the beneficiary amount, at least 5.00% would need to be put up as collateral. The maximum of this and the minimum bond will be used to secure the proposal, refundable if it passes.' />
												</label>

												<Input
													className='text-input hide-pointer'
													value='5.00%'
													size='big'
												/>
											</Form.Field>
										</Form.Group>

										{/* Minimum Bond */}
										<Form.Group>
											<Form.Field width={16} className='input-form-field'>
												<label className='input-label'>
												Minimum Bond
													<HelperTooltip content='The minimum amount that will be bonded.' />
												</label>

												<Input
													className='text-input hide-pointer'
													value='100.0000 DOT'
													size='big'
												/>
											</Form.Field>
										</Form.Group>

										<Message color='yellow' className='text-input topMargin'>
											<p><Icon name='warning circle' /> Be aware that once submitted the proposal will be put to a council vote. If the proposal is rejected due to a lack of info, invalid requirements or non-benefit to the network as a whole, the full bond posted (as describe above) will be lost.</p>
										</Message>
									</div>

									<div className='post-form-div'>
										<Controller
											as={<TitleForm
												errorTitle={errors.title}
											/>}
											control={control}
											name='title'
											onChange={onTitleChange}
											rules={{ required: true }}
										/>

										<Controller
											as={<ContentForm
												errorContent={errors.content}
											/>}
											control={control}
											name='content'
											onChange={onPostDescriptionChange}
											rules={{ required: true }}
										/>
									</div>
								</Form>
							</Grid.Column>
						</Grid>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions className='modal-actions'>
					<Button floated='right' className='submitBtn' onClick={handleSubmit(handleSignAndSubmit)}>Sign &amp; Submit</Button>
					<Button floated='right' onClick={() => setTipModalOpen(false)}>Close</Button>
				</Modal.Actions>
			</Modal>
	);

};

export default styled(ProposalFormButton)`
	.text-center  {
		text-align : center;
	}

	.link-btn, .link-btn:hover, .link-btn:focus {
		background-color: #e5007a;
		color: #fff;
	}

	.modal-header{
		text-transform: capitalize;
	}

	.modal-desc{
		margin-left: -1.8em;
	}

	.topMargin {
		margin-top: 2em;
	}
	
	.input-label {
		margin-left: 1.4em !important;
	}

	.availableAccountsForm {
		width: 100%;
		padding-left: 1.5em;
		padding-right: 1em;
	}

	.availableAddressItem {
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}

	.availableAddressOptions{ 
		display: flex;
		justify-content: space-between;
		margin-bottom: 1em;
	}
	
	.availableAddressToggle {
		color: pink_primary;
		cursor: pointer;
		margin-left: 1.5em;
		margin-top: 0.25em;
	}

	.accountInputDiv { 
		display: flex;
		align-items: center;

		.identicon {
			margin-right: -1.2em;
			z-index: 10;
		}
	}

	.input-form-field {
		margin-right: 1.5em !important;
	}

	.text-input{
		margin-left: 1.5em;
	}

	.textarea-input {
		min-height: 100;
		margin-left: 1.5em !important;
	}

	.hide-pointer{
		pointer-events:none;
	}

	/* Hides Increment Arrows in number input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type=number] {
		-moz-appearance: textfield;
	}

	.post-form-div {
		border-top: 1px solid #ddd;
		padding-top: 2em;
		margin-left: 1em;
		margin-top: 2.5em;
	}

	.modal-actions{
		margin-bottom: 2.4em !important;
	}

	.submitBtn{
		background-color: pink_primary;
		color: #fff;
	}
`;
