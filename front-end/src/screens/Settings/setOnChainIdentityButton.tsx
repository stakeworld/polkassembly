// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import BN from 'bn.js';
import React, { useContext, useState } from 'react';
import { Button, Form, Grid, Icon, Input, Modal, Popup } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { chainProperties } from 'src/global/networkConstants';
import BalanceInput from 'src/ui-components/BalanceInput';
import getNetwork from 'src/util/getNetwork';
import { inputToBn } from 'src/util/inputToBn';

interface Props {
	className?: string
	// setTipModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SetOnChainIdentityButton = ({
	className
	// setTipModalOpen,
} : Props) => {
	const { id } = useContext(UserDetailsContext);
	const currentNetwork = getNetwork();

	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const [value, setValue] = useState<BN>();
	const [displayName, setDisplayName] = useState<string>('');
	const [legalName, setLegalName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [website, setWebsite] = useState<string>('');
	const [twitter, setTwitter] = useState<string>('');
	const [riotName, setRiotName] = useState<string>('');

	const onBalanceChange = (balance: BN) => setValue(balance);

	const [errorsFound, setErrorsFound] = useState<string[]>([]);
	const isFormValid = () => {
		const errorsFound: string[] = [];

		if(!displayName) {
			errorsFound.push('displayName');
		}

		const [balance, isValid] = inputToBn(`${value}`, false);
		if(!isValid){
			setErrorsFound(errorsFound);
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

	const handleSignAndSubmit = () => {
		if(!isFormValid()) return;

		console.log('errorsFound : ', errorsFound);
	};

	const triggerBtn = <Button disabled={!id} style={ { background: '#E5007A', color:'#fff', textTransform: 'capitalize' } } size='huge'> <Icon name='linkify' /> Set On-Chain Identity</Button>;
	const triggerBtnLoginDisabled = <Popup position='bottom center' content='Please signup/login to set on-chain identity' trigger={<Button style={ {  background: '#E5007A', backgroundImage: 'none', boxShadow: 'none',  color:'#fff', cursor: 'default', opacity: '.45', textTransform: 'capitalize' } } size='huge'> <Icon name='linkify' /> Set On-Chain Identity</Button> } />;

	return (
		<Modal
			className={className}
			closeOnEscape={false}
			closeOnDimmerClick={false}
			onClose={() => setModalOpen(false)}
			onOpen={() => setModalOpen(true)}
			open={modalOpen}
			size='small'
			trigger={!id ? triggerBtnLoginDisabled : triggerBtn}
		>
			<Modal.Header className='text-center modal-header'>
				Set On-Chain Identity
			</Modal.Header>
			<Modal.Content scrolling>
				<Modal.Description className='modal-desc'>
					<Grid centered stackable verticalAlign='middle' reversed='mobile tablet'>
						<Grid.Column mobile={13} tablet={13} computer={12}>
							<Form className='identity-form'>
								{/* Display Name */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Display Name</label>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={displayName}
											onChange={ (e) => setDisplayName(e.target.value)}
											error={errorsFound.includes('displayName')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Legal Name */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Legal Name</label>
											<span>*Optional</span>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={legalName}
											onChange={ (e) => setLegalName(e.target.value)}
											error={errorsFound.includes('legalName')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Email */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Email</label>
											<span>*Optional</span>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={email}
											onChange={ (e) => setEmail(e.target.value.toLowerCase())}
											error={errorsFound.includes('email')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Website */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Website</label>
											<span>*Optional</span>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={website}
											onChange={ (e) => setWebsite(e.target.value)}
											error={errorsFound.includes('website')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Twitter */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Twitter</label>
											<span>*Optional</span>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={twitter}
											onChange={ (e) => setTwitter(e.target.value)}
											error={errorsFound.includes('twitter')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Riot Name */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Riot Name</label>
											<span>*Optional</span>
										</div>
										<Input
											className='custom-input'
											fluid size='large'
											value={riotName}
											onChange={ (e) => setRiotName(e.target.value)}
											error={errorsFound.includes('riotName')}
										/>
									</Form.Field>
								</Form.Group>

								{/* Total Deposit */}
								<Form.Group className='form-group'>
									<Form.Field width={16}>
										<div className='input-label-div'>
											<label>Total Deposit</label>
										</div>

										<div className="balance-input">
											<BalanceInput
												placeholder={'0'}
												className='text-input'
												onChange={onBalanceChange}
											/>
											<span>
												{chainProperties[currentNetwork].tokenSymbol}
											</span>
										</div>
									</Form.Field>
								</Form.Group>
							</Form>
						</Grid.Column>
					</Grid>
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions className='modal-actions'>
				<Button floated='right' className='submitBtn' onClick={ handleSignAndSubmit }>Set Identity</Button>
				<Button floated='right' onClick={() => setModalOpen(false)}>Close</Button>
			</Modal.Actions>
		</Modal>
	);

};

export default styled(SetOnChainIdentityButton)`
	.text-center  {
		text-align : center;
	}
	.modal-header{
		text-transform: capitalize;
	}
	.modal-desc{
		margin-left: -1.8em;
	}

	.form-group{
		margin-bottom: 1.5em !important;

		.custom-input { 
			padding-left: 0.5em;
			padding-right: 0.5em;

			&.error > input {
				border-color: #e0b4b4 !important;
				color: #9f3a38 !important;
			}
		}
	}
	
	.input-label-div {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5em !important;
		padding-left: 0.5em;
		padding-right: 0.5em;

		label {
			font-weight: bold;
		}
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
	.balance-input {
		display: flex;
		align-items: center;
		span {
			margin-top: -0.9em;
		}
	}
`;