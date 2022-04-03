// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import type { Data, Option } from '@polkadot/types';
import type { Registration } from '@polkadot/types/interfaces';
import { u8aToString } from '@polkadot/util';
import { checkAddress } from '@polkadot/util-crypto';
import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Icon, Input, Modal, Popup } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { NotificationContext } from 'src/context/NotificationContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { addressPrefix } from 'src/global/addressPrefix';
import { APPNAME } from 'src/global/appName';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType, NotificationStatus } from 'src/types';
import Card from 'src/ui-components/Card';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

import AddressComponent from '../../ui-components/Address';

interface Props {
	className?: string
	// setTipModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

enum AvailableAccountsInput {
	submitWithAccount
}
interface ValueState {
	info: Record<string, unknown>;
	okAll: boolean;
	okDisplay?: boolean;
	okEmail?: boolean;
	okLegal?: boolean;
	okRiot?: boolean;
	okTwitter?: boolean;
	okWeb?: boolean;
}

const WHITESPACE = [' ', '\t'];

const DEPOSIT: Record<string, number> = {
	'kusama': 33.3333,
	'moonbeam': 12.5800,
	'moonriver': 1.0258,
	'polkadot': 20.2580
};

function setHasVal(val: string, setActive: null | ((isActive: boolean) => void)): void {
	if (val){
		setActive && setActive(true);
	}
	else{
		setActive && setActive(false);
	}
}

function setData (data: Data, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): void {
	if (data.asRaw.length != 0) {
		setActive && setActive(true);
		setVal(u8aToString(data.asRaw.toU8a(true)));
	}
}

function checkValue (hasValue: boolean, value: string | null | undefined, minLength: number, includes: string[], excludes: string[], starting: string[], notStarting: string[] = WHITESPACE, notEnding: string[] = WHITESPACE): boolean {
	return !hasValue || (
		!!value &&
		(value.length >= minLength) &&
		includes.reduce((hasIncludes: boolean, check) => hasIncludes && value.includes(check), true) &&
		(!starting.length || starting.some((check) => value.startsWith(check))) &&
		!excludes.some((check) => value.includes(check)) &&
		!notStarting.some((check) => value.startsWith(check)) &&
		!notEnding.some((check) => value.endsWith(check))
	);
}

const SetOnChainIdentityButton = ({
	className
	// setTipModalOpen,
} : Props) => {
	const { id } = useContext(UserDetailsContext);
	const currentNetwork = getNetwork();

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [validAddress, setValidAddress] = useState<boolean>(false);
	const { queueNotification } = useContext(NotificationContext);

	const [displayName, setDisplayName] = useState<string>('');
	const [legalName, setLegalName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [website, setWebsite] = useState<string>('');
	const [twitter, setTwitter] = useState<string>('');
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [riotName, setRiotName] = useState<string>('');
	const [identityOpt, setidentityOpt] = useState<Option<Registration>>();
	const [{ info, okAll, okDisplay, okEmail, okLegal, okRiot, okTwitter, okWeb }, setInfo] = useState<ValueState>({ info: {}, okAll: false });
	const [hasEmail, setHasEmail] = useState(false);
	const [hasLegal, setHasLegal] = useState(false);
	const [hasRiot, setHasRiot] = useState(false);
	const [hasTwitter, setHasTwitter] = useState(false);
	const [hasWeb, setHasWeb] = useState(false);
	const { api, apiReady } = useContext(ApiContext);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const [showAvailableAccountsObj, setShowAvailableAccountsObj] = useState<{ [key: string]: boolean}>({
		'submitWithAccount': false
	});
	const [submitWithAccount, setSubmitWithAccount] = useState<string>('');

	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });

	const [, setErrorsFound] = useState<string[]>([]);
	const isFormValid = () => {
		const errorsFound: string[] = [];

		if(!displayName) {
			errorsFound.push('displayName');
		}

		if(errorsFound.length > 0){
			setErrorsFound(errorsFound);
			return false;
		}else{
			setErrorsFound([]);
		}

		return true;
	};

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
			'submitWithAccount': false
		};

		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			availableAccountsObj.submitWithAccount = !showAvailableAccountsObj['submitWithAccount'];
			break;
		}

		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const isSelected = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			return submitWithAccount === address;
		}
	};

	const handleSelectAvailableAccount = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			setSubmitWithAccount(address);
			break;
		}

		// Close dropdown on select
		const availableAccountsObj : { [key: string]: boolean } = {
			'submitWithAccount': false
		};
		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const onSubmitWithAccountChange = (address: string) => {
		setSubmitWithAccount(address);
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

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const [validAddress] = checkAddress(submitWithAccount, addressPrefix[currentNetwork]);

		setValidAddress(validAddress);

		if (validAddress) {

			try{
				api.query.identity.identityOf(submitWithAccount, (data: any) =>
					setidentityOpt(data)
				);
			}catch(e){
				setidentityOpt(undefined);
			}

			if (identityOpt && identityOpt.isSome) {

				const { info } = identityOpt.unwrap();
				setData(info.display, null, setDisplayName);
				setData(info.email, setHasEmail, setEmail);
				setData(info.legal, setHasLegal, setLegalName);
				setData(info.riot, setHasRiot, setRiotName);
				setData(info.twitter, setHasTwitter, setTwitter);
				setData(info.web, setHasWeb, setWebsite);

				[info.display, info.email, info.legal, info.riot, info.twitter, info.web].some((info: Data) => {
					if (info.isRaw) {
						return true;
					} else {
						return false;
					}
				});
			}
			else{
				setDisplayName('');
				setHasEmail(false);
				setEmail('');
				setHasLegal(false);
				setLegalName('');
				setHasRiot(false);
				setRiotName('');
				setHasTwitter(false);
				setTwitter('');
				setHasWeb(false);
				setWebsite('');
			}
		}
		else {
			setDisplayName('');
			setHasEmail(false);
			setEmail('');
			setHasLegal(false);
			setLegalName('');
			setHasRiot(false);
			setRiotName('');
			setHasTwitter(false);
			setTwitter('');
			setHasWeb(false);
			setWebsite('');
		}
	}, [api, apiReady, submitWithAccount, identityOpt, currentNetwork]);

	useEffect((): void => {
		const okDisplay = checkValue(true, displayName, 1, [], [], []);
		setHasVal(email, setHasEmail);
		const okEmail = checkValue(hasEmail, email, 3, ['@'], WHITESPACE, []);
		setHasVal(legalName, setHasLegal);
		const okLegal = checkValue(hasLegal, legalName, 1, [], [], []);
		setHasVal(riotName, setHasRiot);
		const okRiot = checkValue(hasRiot, riotName, 6, [':'], WHITESPACE, ['@', '~']);
		setHasVal(twitter, setHasTwitter);
		const okTwitter = checkValue(hasTwitter, twitter, 3, [], WHITESPACE, ['@']);
		setHasVal(website, setHasWeb);
		const okWeb = checkValue(hasWeb, website, 8, ['.'], WHITESPACE, ['https://', 'http://']);

		setInfo({
			info: {
				display: { [okDisplay ? 'raw' : 'none']: displayName || null },
				email: { [okEmail && hasEmail ? 'raw' : 'none']: okEmail && hasEmail ? email : null },
				legal: { [okLegal && hasLegal ? 'raw' : 'none']: okLegal && hasLegal ? legalName : null },
				riot: { [okRiot && hasRiot ? 'raw' : 'none']: okRiot && hasRiot ? riotName : null },
				twitter: { [okTwitter && hasTwitter ? 'raw' : 'none']: okTwitter && hasTwitter ? twitter : null },
				web: { [okWeb && hasWeb ? 'raw' : 'none']: okWeb && hasWeb ? website : null }
			},
			okAll: okDisplay && okEmail && okLegal && okRiot && okTwitter && okWeb,
			okDisplay,
			okEmail,
			okLegal,
			okRiot,
			okTwitter,
			okWeb
		});
	}, [hasEmail, hasLegal, hasRiot, hasTwitter, hasWeb, displayName, email, legalName, riotName, twitter, website]);

	const handleSignAndSubmit = async () => {
		if(!isFormValid()) return;

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		const identity = api.tx.identity.setIdentity(info);

		identity.signAndSend(submitWithAccount, ({ status }) => {
			if (status.isInBlock) {
				queueNotification({
					header: 'Success!',
					message: `Identity credentials submitted for verification, you will recieve an email from registrar shortly. Txn hash ${identity.hash}`,
					status: NotificationStatus.SUCCESS
				});
				setLoadingStatus({ isLoading: false, message: '' });
				setModalOpen(false);
				console.log(`Completed at block hash #${status.asInBlock.toString()}`);
			} else {
				if (status.isBroadcast){
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the identity' });
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

	const triggerBtn = <Button disabled={!id} style={ { background: '#E5007A', color:'#fff', textTransform: 'capitalize' } } size='huge'> <Icon name='linkify' /> Set On-Chain Identity</Button>;
	const triggerBtnLoginDisabled = <Popup position='bottom center' content='Please signup/login to set on-chain identity' trigger={<Button style={ {  background: '#E5007A', backgroundImage: 'none', boxShadow: 'none',  color:'#fff', cursor: 'default', opacity: '.45', textTransform: 'capitalize' } } size='huge'> <Icon name='linkify' /> Set On-Chain Identity</Button> } />;

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
									{/* Select account */}
									<Form.Group>
										<Form.Field width={16}>
											<label className='input-label-div'>
												Submit with account
												<HelperTooltip content='Set identity for account' />
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
													onChange={ (e) => onSubmitWithAccountChange(e.target.value)}
													placeholder='Account Address'
													error={!validAddress}
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
												placeholder='My On-Chain Name'
												onChange={ (e) => setDisplayName(e.target.value)}
												error={!okDisplay}
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
												placeholder='Full Legal Name'
												value={legalName}
												onChange={ (e) => setLegalName(e.target.value)}
												error={!okLegal}
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
												placeholder='somebody@example.com'
												onChange={ (e) => setEmail(e.target.value.toLowerCase())}
												error={!okEmail}
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
												placeholder='https://example.com'
												onChange={ (e) => setWebsite(e.target.value)}
												error={!okWeb}
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
												placeholder='@YourTwitterName'
												onChange={ (e) => setTwitter(e.target.value)}
												error={!okTwitter}
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
												placeholder='@yourname:matrix.org'
												onChange={ (e) => setRiotName(e.target.value)}
												error={!okRiot}
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
												<Input
													placeholder={'0'}
													className='custom-input'
													fluid size='large'
													// onChange={onBalanceChange}
													value={DEPOSIT[currentNetwork]}
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
					<Button disabled={!okAll} floated='right' className='submitBtn' onClick={ handleSignAndSubmit }>Set Identity</Button>
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
