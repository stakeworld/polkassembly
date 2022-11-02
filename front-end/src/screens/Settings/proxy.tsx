// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import styled from '@xstyled/styled-components';
import React, { useContext, useState } from 'react';
import { DropdownProps } from 'semantic-ui-react';

import { ApiContext } from '../../context/ApiContext';
import { NotificationContext } from '../../context/NotificationContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useLinkProxyAddressMutation } from '../../generated/graphql';
import { APPNAME } from '../../global/appName';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import AccountSelectionForm from '../../ui-components/AccountSelectionForm';
import Button from '../../ui-components/Button';
import FilteredError from '../../ui-components/FilteredError';
import { Form } from '../../ui-components/Form';
import Modal from '../../ui-components/Modal';
import cleanError from '../../util/cleanError';
import getEncodedAddress from '../../util/getEncodedAddress';
import getNetwork from '../../util/getNetwork';

const NETWORK = getNetwork();

const Proxy = ({ className }: {className?: string}): JSX.Element => {
	const currentUser = useContext(UserDetailsContext);
	const [showModal, setShowModal] = useState(false);
	const [proxyAddress, setProxyAddress] = useState<string>('');
	const [proxiedAccount, setProxiedAccount] = useState<string>('');
	const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const [linkProxyAddressMutation, { loading, error }] = useLinkProxyAddressMutation();
	const { queueNotification } = useContext(NotificationContext);
	const { api, apiReady } = useContext(ApiContext);

	//open modal and fetch and populate addressOptions (dropdown);
	const openModal = async () => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotFound(true);
			return;
		} else {
			setExtensionNotFound(false);
		}

		const availableAccounts = await web3Accounts();

		availableAccounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		const accounts = availableAccounts;

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			return;
		} else {
			setAccountsNotFound(false);
		}

		setAccounts(accounts);

		setShowModal(true);
	};

	const dismissModal = () => {
		setShowModal(false);
	};

	const onProxiedAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => setProxiedAccount(event.currentTarget.value);

	const onProxyAddressChange = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setProxyAddress(data.value as string);
	};

	const handleSign = async (): Promise<undefined> => {
		if (!accounts.length) {
			return;
		}

		try {
			const injected = await web3FromSource(accounts[0].meta.source);
			const signRaw = injected && injected.signer && injected.signer.signRaw;

			if (!signRaw) {
				console.error('Signer not available');
				return;
			}

			const message = `<Bytes>I am linking proxied address ${proxiedAccount}</Bytes>`;

			const { signature } = await signRaw({
				address: proxyAddress,
				data: stringToHex(message || ''),
				type: 'bytes'
			});

			const linkProxyAddressMutationResult = await linkProxyAddressMutation({
				variables: {
					message,
					network: NETWORK,
					proxied: proxiedAccount,
					proxy: proxyAddress,
					signature
				}
			});

			if (linkProxyAddressMutationResult.data?.linkProxyAddress?.token) {
				handleTokenChange(linkProxyAddressMutationResult.data?.linkProxyAddress?.token, currentUser);
			}

			queueNotification({
				header: 'Success!',
				message: linkProxyAddressMutationResult.data?.linkProxyAddress?.message || '',
				status: NotificationStatus.SUCCESS
			});

			dismissModal();
		} catch (error) {
			console.error(error);
			queueNotification({
				header: 'Failed!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});
		}
	};

	return (
		<>
			{showModal ?
				<Modal
					className={className}
					buttons={
						<Form.Group>
							<Button
								content='Sign'
								disabled={loading}
								icon='check'
								primary
								onClick={handleSign}
							/>
							<Button
								content='Close'
								icon='close'
								secondary
								onClick={dismissModal}
							/>
						</Form.Group>
					}
					centered
					dimmer='inverted'
					open
					onClose={dismissModal}
					size='tiny'
					title={'Link Proxy address'}
				>
					<Form standalone={false}>
						{extensionNotFound ? <div className='error'>
							<div>Please install polkadot.js extension</div>
						</div> : null}

						{accountsNotFound ? <div className='error'>
							<div>At least one proxy account should be in your polkadot js extension.</div>
							<div>Please reload this page after adding accounts.</div>
						</div> : <div>
							<Form.Group>
								<Form.Field width={16}>
									<label>Proxied Address</label>
									<input
										value={proxiedAccount}
										onChange={onProxiedAccountChange}
										placeholder='address'
										type='text'
									/>
								</Form.Field>
							</Form.Group>
							<Form.Group>
								<Form.Field width={16}>
									<AccountSelectionForm
										title='Select proxy account'
										accounts={accounts}
										address={proxyAddress}
										onAccountChange={onProxyAddressChange}
									/>
								</Form.Field>
							</Form.Group>
						</div>
						}
						{error?.message && <FilteredError text={error.message}/>}
					</Form>
				</Modal>
				: null
			}
			<Form standalone={false} id='linkProxyAccount'>
				<Form.Group>
					<Form.Field width={16}>
						<label>Proxy</label>
						<div className='text-muted'>You can link a <a rel='noopener noreferrer' target='_blank' href='https://wiki.polkadot.network/docs/learn-proxies'>proxy address</a> here.</div>
						<Button
							primary
							disabled={loading}
							onClick={openModal}
							type="submit"
						>
							Link Proxy Address
						</Button>
					</Form.Field>
				</Form.Group>
			</Form>
		</>
	);
};

export default styled(Proxy)`
	.error {
		color: red_secondary;
		font-size: sm;
	}
`;