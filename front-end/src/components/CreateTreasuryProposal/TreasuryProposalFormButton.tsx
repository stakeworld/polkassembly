// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import styled from '@xstyled/styled-components';
import BN from 'bn.js';
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Form, Grid, Icon, Input, Label, Message, Modal, Popup } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { NotificationContext } from 'src/context/NotificationContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddPolkassemblyProposalMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType, NotificationStatus } from 'src/types';
import BalanceInput from 'src/ui-components/BalanceInput';
import Card from 'src/ui-components/Card';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

import { PolkassemblyProposalTypes } from '../../types';
import AddressComponent from '../../ui-components/Address';
import { inputToBn } from '../../util/inputToBn';
import ContentForm from '../ContentForm';
import TitleForm from '../TitleForm';

const currentNetwork = getNetwork();

const minimumBond = chainProperties[currentNetwork].tokenSymbol === 'DOT' ? '100.0000 DOT' : '66.66 mKSM';

interface Props {
	className?: string
	// setTipModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

enum AvailableAccountsInput {
	submitWithAccount,
	beneficiary
}

const TreasuryProposalFormButton = ({
	className
	// setTipModalOpen,
} : Props) => {

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [showAvailableAccountsObj, setShowAvailableAccountsObj] = useState<{ [key: string]: boolean}>({
		'beneficiary': false,
		'submitWithAccount': false
	});
	const [submitWithAccount, setSubmitWithAccount] = useState<string>('');
	const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
	const [value, setValue] = useState<BN>(new BN(0));
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDescription, setPostDescription] = useState<string>('');
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });
	const { queueNotification } = useContext(NotificationContext);
	const [addPolkassemblyProposalMutation] = useAddPolkassemblyProposalMutation();

	const { control, errors, handleSubmit } = useForm();

	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	const { id, web3signup, defaultAddress } = useContext(UserDetailsContext);

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

	const onBalanceChange = (balance: BN) => setValue(balance);

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
		const [balance, isValid] = inputToBn(`${value}`, false);
		if(!isValid){
			return false;
		}else{
			setValue(balance);
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

		const proposalId: number = (await api.query.treasury.proposalCount()).toNumber();

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

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });
		try {
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
					const authorId = id;
					if (!authorId){
						return;
					}
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
				setModalOpen(false);
				queueNotification({
					header: 'Failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
			});
		}
		catch(error){
			setLoadingStatus({ isLoading: false, message: '' });
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			setModalOpen(false);
			queueNotification({
				header: 'Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		}
	};

	const triggerBtn = <Button disabled={!id} style={ { background: '#E5007A', color:'#fff', textTransform: 'capitalize' } } size='huge'> <Icon name='plus circle' /> Create Treasury Proposal</Button>;
	const triggerBtnLoginDisabled = <Popup position='bottom center' content='Please signup/login using a web3 address to add a treasury proposal' trigger={<Button style={ {  background: '#E5007A', backgroundImage: 'none', boxShadow: 'none',  color:'#fff', cursor: 'default', opacity: '.45', textTransform: 'capitalize' } } size='huge'> <Icon name='plus circle' /> Create Treasury Proposal</Button> } />;

	return (
		loadingStatus.isLoading
			? <Card className={'LoaderWrapper'}>
				<Loader text={loadingStatus.message}/>
			</Card>:
			<Modal
				className={className}
				closeOnEscape={false}
				closeOnDimmerClick={false}
				onClose={() => setModalOpen(false)}
				onOpen={() => setModalOpen(true)}
				open={modalOpen}
				size='small'
				trigger={!id ? triggerBtnLoginDisabled : web3signup || defaultAddress ? triggerBtn: <Popup position='bottom center' content='Please login using a web3 address' trigger={triggerBtn} />}>
				<Modal.Header className='text-center modal-header'>
					<div>Create Treasury Proposal</div>
					<Button onClick={() => setModalOpen(false)} icon='close' />
				</Modal.Header>
				<Modal.Content scrolling>
					<Modal.Description className='modal-desc'>
						<Grid centered stackable verticalAlign='middle' reversed='mobile tablet'>
							<Grid.Column mobile={13} tablet={13} computer={12}>
								<Form>
									<br />
									<h5>Enter On-chain Data</h5>

									<div className='topMargin'>
										{/* Submit with account */}
										<Form.Group>
											<Form.Field width={16}>
												<label className='input-label'>
													Submit with account
													<HelperTooltip content='This account will make the proposal and be responsible for the bond.' iconSize='small' />
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
													<HelperTooltip content='The beneficiary will receive the full amount if the proposal passes.' iconSize='small' />
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
										<Form.Group className='value-form-group'>
											<Form.Field width={13}>
												<BalanceInput
													label={'Value'}
													helpText={'The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.'}
													placeholder={'0'}
													className='text-input'
													onChange={onBalanceChange}
													iconSize='small'
												/>
											</Form.Field>
											<Form.Field width={3} className='input-form-field'>
												<Label size='big'>
													{chainProperties[currentNetwork].tokenSymbol}
													{/* <Dropdown upward={false} defaultValue='nano' options={valueUnitOptions} onChange={(event, { value }) => setValueUnit(value as string)} /> */}
												</Label>
											</Form.Field>
										</Form.Group>

										{/* Proposal Bond */}
										<Form.Group>
											<Form.Field width={16} className='input-form-field'>
												<label className='input-label'>
													Proposal Bond
													<HelperTooltip content='Of the beneficiary amount, at least 5.00% would need to be put up as collateral. The maximum of this and the minimum bond will be used to secure the proposal, refundable if it passes.' iconSize='small' />
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
													<HelperTooltip content='The minimum amount that will be bonded.' iconSize='small' />
												</label>

												<Input
													className='text-input hide-pointer'
													value={minimumBond}
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
					{/* TODO: change onclick to () => setTipModalOpen(false)*/}
				</Modal.Actions>
			</Modal>
	);

};

export default styled(TreasuryProposalFormButton)`
	.text-center  {
		text-align : center;
	}

	.link-btn, .link-btn:hover, .link-btn:focus {
		background-color: #e5007a;
		color: #fff;
	}

	.modal-header{
		text-transform: capitalize;
		display: flex !important;
		align-items: center !important;

		div, button{
			display: flex;
			align-items: center;
		}

		div, button {
			margin-left: auto;
		}

		button {
			border: solid 2px #fff;
    	border-radius: 50%;
			background: #eee;
		}
	}

	.modal-desc{
		margin-left: -1.8em;
	}

	.topMargin {
		margin-top: 2em;
	}
	
	.input-label {
		margin-left: 1.4em !important;
		display: flex !important;
		align-items: center !important;
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

	.value-form-group{
		display: flex !important;
		align-items: center;
		margin-left: 0.45em !important;
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

