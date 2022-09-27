// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import React, { useContext, useState } from 'react';
import { Button, Form, Icon, Input, Message, Modal } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { NotificationContext } from 'src/context/NotificationContext';
import { APPNAME } from 'src/global/appName';
import { NotificationStatus } from 'src/types';
import getEncodedAddress from 'src/util/getEncodedAddress';
import styled from 'styled-components';

import AddressComponent from '../../ui-components/Address';

const ClaimPayoutModal = ({ className, parentBountyId, childBountyId } : { className?: string, parentBountyId:number | undefined, childBountyId:number | undefined }) => {
	const { api, apiReady } = useContext(ApiContext);
	const { queueNotification } = useContext(NotificationContext);

	const [modalopen, setModalOpen] = useState<boolean>(false);
	const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState<boolean>(false);
	const [showAvailableAccounts, setShowAvailableAccounts] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleDetect = async () => {
		if(showAvailableAccounts){
			setShowAvailableAccounts(false);
			return;
		}

		const extensions = await web3Enable(APPNAME);
		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const allAccounts = await web3Accounts();
		setAvailableAccounts(allAccounts);
		setShowAvailableAccounts(true);
	};

	const handleSelectAvailableAccount = (address: string) => {
		if(isLoading) return;
		setBeneficiaryAccount(address);
		setShowAvailableAccounts(true);
	};

	const handleSignAndSubmit = async () => {
		if(!beneficiaryAccount || !parentBountyId || !childBountyId || isLoading) return;

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		setIsLoading(true);

		try {
			const claim = api.tx.childBounties.claimChildBounty(parentBountyId, childBountyId);
			claim.signAndSend(beneficiaryAccount, ({ status }) => {
				if (status.isInBlock) {
					queueNotification({
						header: 'Success!',
						message: ' Claim Payout successful.',
						status: NotificationStatus.SUCCESS
					});
					console.log(`Completed at block hash #${status.asInBlock.toString()}`);
				} else {
					console.log(`Current status: ${status.type}`);
				}
				setIsLoading(false);
				setModalOpen(false);
			}).catch((error) => {
				setIsLoading(false);
				console.log(':( transaction failed');
				console.error('ERROR:', error);
				setModalOpen(false);
				queueNotification({
					header: 'Payout Claim Failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
			});
		}
		catch(error){
			setIsLoading(false);
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			setModalOpen(false);
			queueNotification({
				header: 'Payout Claim Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		}
	};

	const getAvailableAccounts = () => {
		return (
			<Form.Group className='availableAccountsForm'>
				<Form.Field width={16}>
					{availableAccounts.map(account => {
						const address = getEncodedAddress(account.address);

						return address &&
							<div key={address} onClick={() => handleSelectAvailableAccount(address)} className='availableAddressItem'>
								<div style={ isLoading ? { opacity: '0.5' } : {} } className='item'>
									<AddressComponent className='item' address={address} extensionName={account.meta.name} />
								</div>
								{beneficiaryAccount === address ? <Icon name='check circle' /> : <Icon name='circle outline' />}
							</div>;
					})}
				</Form.Field>
			</Form.Group>
		);
	};

	const primaryBtnStyle = { background: '#E5007A', color: '#fff', fontSize: '12px',  marginBottom: '4px', marginTop: '6px' };

	const triggerBtn = <Button style={ primaryBtnStyle }>Claim Payout</Button>;

	return (
		<Modal
			open={modalopen}
			onClose={() => { if(!isLoading) setModalOpen(false);}}
			onOpen={() => setModalOpen(true)}
			trigger={triggerBtn}
			size='tiny'
			className={className}
		>
			<Modal.Header> <h5 className='text-center' >Confirm payout claim</h5> </Modal.Header>
			<Modal.Content>

				<Message info>
					<Message.Header>
						Thank you for your work to support the community. Please submit the transaction to claim the transaction.
					</Message.Header>
				</Message>

				<Form.Group>
					<Form.Field width={16}>
						<label className='input-label'>Please select your account</label>

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
								disabled={isLoading}
								// error={errorsFound.includes('beneficiaryAccount')}
							/>
						</div>

						{!extensionNotAvailable && <div className='availableAddressOptions'>
							<div onClick={() => handleDetect()} className='availableAddressToggle'>
								or choose from available addresses
								{showAvailableAccounts ? <Icon name='chevron up' /> : <Icon name='chevron down' />}
							</div>
						</div>}
						{extensionNotAvailable && <div className="error">Please install polkadot.js extension</div>}
						{showAvailableAccounts && availableAccounts.length > 0 && getAvailableAccounts()}
					</Form.Field>
				</Form.Group>
			</Modal.Content>
			<Modal.Actions>
				<Button style={ { fontSize: '12px' } } loading={isLoading} disabled={isLoading} onClick={() => setModalOpen(false)}>Cancel</Button>
				<Button floated='right' className='submitBtn' disabled={isLoading} loading={isLoading} onClick={() => handleSignAndSubmit()}>Sign &amp; Submit</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default styled(ClaimPayoutModal)`
	padding: 8px;

	.text-center {
		text-align: center;
	}

	.message {
		font-size: 10px;
		margin-bottom: 16px;
	}

	.input-label {
		margin-left: 1.6em !important;
		display: flex !important;
		align-items: center !important;
		font-size: 10px;
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

		.input {
			width: 100%;
		}

		.identicon {
			margin-right: -1.2em;
			z-index: 10;
		}
	}

	.submitBtn{
		background-color: #E5007A;
		color: #fff;
		font-size: 12px;
	}
`;
