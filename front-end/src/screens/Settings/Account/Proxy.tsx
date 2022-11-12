// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import { Alert, Button, Form, Input, Modal } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import ExtensionNotDetected from 'src/components/ExtensionNotDetected';
import { useUserDetailsContext } from 'src/context';
import { useLinkProxyAddressMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { handleTokenChange } from 'src/services/auth.service';
import { NotificationStatus } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import FilteredError from 'src/ui-components/FilteredError';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

interface Props {
	open?: boolean;
	dismissModal?: () => void;
}

const NETWORK = getNetwork();

const Proxy: FC<Props> = ({ dismissModal, open }) => {
	const [form] = Form.useForm();

	const currentUser = useUserDetailsContext();
	const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [proxyAddress, setProxyAddress] = useState<string>('');
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const [linkProxyAddressMutation, { loading, error }] = useLinkProxyAddressMutation();

	const onProxyAddressChange = (event: React.SyntheticEvent<HTMLElement, Event>, address: string) => {
		setProxyAddress(address);
	};

	//open modal and fetch and populate addressOptions (dropdown);
	const fetchAddressOptions = async () => {
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
		if (accounts.length > 0) {
			setProxyAddress(accounts[0]?.address);
		}
	};

	useEffect(() => {
		fetchAddressOptions();
	}, []);

	const handleSign = async (data: any) => {
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

			const message = `<Bytes>I am linking proxied address ${data?.proxiedAccount}</Bytes>`;

			const { signature } = await signRaw({
				address: proxyAddress,
				data: stringToHex(message || ''),
				type: 'bytes'
			});

			const linkProxyAddressMutationResult = await linkProxyAddressMutation({
				variables: {
					message,
					network: NETWORK,
					proxied: data?.proxiedAccount,
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
		<Modal
			closable={false}
			title={
				<span className='font-medium text-lg tracking-wide text-sidebarBlue'>
					Link Proxy address
				</span>
			}
			open={open}
			className='mb-8 md:min-w-[600px]'
			footer={
				[
					<Button
						disabled={accountsNotFound}
						key="sign"
						htmlType='submit'
						onClick={() => {
							form.submit();
						}}
						loading={loading}
						className={`rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary ${accountsNotFound? 'bg-gray-300': ''}`}
					>
						Sign
					</Button>,
					<Button
						key="cancel"
						onClick={dismissModal}
						className='rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary'
					>
						Cancel
					</Button>
				]
			}
		>
			{
				extensionNotFound
					? <div className='max-w-[600px]'><ExtensionNotDetected /></div>
					: <Form
						form={form}
						onFinish={handleSign}
						className='flex flex-col gap-y-8'
					>
						{
							accountsNotFound
								? <Alert
									type='warning'
									message={<>
										<p>At least one proxy account should be in your polkadot js extension.</p>
										<p>Please reload this page after adding accounts.</p>
									</>}
								/>

								: <>
									<section>
										<label
											className='flex items-center gap-x-3 text-sm text-sidebarBlue font-normal tracking-wide leading-6'
											htmlFor='proxiedAccount'
										>
                                            Proxied Address
										</label>
										<Form.Item
											name="proxiedAccount"
											className='m-0 mt-2.5'
										>
											<Input
												placeholder='Enter a valid proxy address'
												className="rounded-md py-3 px-4 border-grey_border"
												id="proxiedAccount"
											/>
										</Form.Item>
									</section>
									<section>
										<AccountSelectionForm
											title='Select proxy account'
											accounts={accounts}
											address={proxyAddress}
											onAccountChange={onProxyAddressChange}
										/>
									</section>
								</>
						}
						{error?.message && <FilteredError text={error.message}/>}
					</Form>
			}
		</Modal>
	);
};

export default Proxy;