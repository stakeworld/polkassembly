// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountFlags, DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedExtension } from '@polkadot/extension-inject/types' ;
import { stringToHex } from '@polkadot/util';
import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, Icon, Table } from 'semantic-ui-react';

import Balance from '../../components/Balance';
import ContentForm from '../../components/ContentForm';
import TitleForm from '../../components/TitleForm';
import { ApiContext } from '../../context/ApiContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useAboutQuery, useChangeAboutMutation } from '../../generated/graphql';
import { APPNAME } from '../../global/appName';
import { useRouter } from '../../hooks';
import { NotificationStatus } from '../../types';
import AddressComponent from '../../ui-components/Address';
import Button from '../../ui-components/Button';
import FilteredError from '../../ui-components/FilteredError';
import { Form } from '../../ui-components/Form';
import Loader from '../../ui-components/Loader';
import Markdown from '../../ui-components/Markdown';
import getEncodedAddress from '../../util/getEncodedAddress';
import getNetwork from '../../util/getNetwork';

interface Props {
	className?: string
}

const CouncilEmoji = () => <span aria-label="council member" className='councilMember' role="img">👑</span>;

const network = getNetwork();

const Profile = ({ className }: Props): JSX.Element => {
	const router = useRouter();
	const address = router.query.address;

	// { data, loading, error }
	const aboutQueryResult = useAboutQuery({
		variables: {
			address,
			network
		}
	});
	const aboutDescription = aboutQueryResult?.data?.about?.description;
	const aboutTitle = aboutQueryResult?.data?.about?.title;

	const { queueNotification } = useContext(NotificationContext);
	const { api, apiReady } = useContext(ApiContext);
	const [identity, setIdentity] = useState<DeriveAccountRegistration | null>(null);
	const [flags, setFlags] = useState<DeriveAccountFlags | undefined>(undefined);
	const [title, setTitle] = useState(aboutTitle || '');
	const [description, setDescription] = useState(aboutDescription || '');
	const [canEdit, setCanEdit] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { control, errors, handleSubmit, setValue } = useForm();

	const noDescription = `This page belongs to address (${address}). Only this user can edit this description and the title. If you own this address, edit this page and tell us more about yourself.`;

	const [changeAboutMutation, { loading, error }] = useChangeAboutMutation();

	useEffect(() => {
		const getAccounts = async (): Promise<undefined> => {
			const extensions = await web3Enable(APPNAME);

			if (extensions.length === 0) {
				return;
			}

			const accounts = await web3Accounts();

			if (accounts.length === 0) {
				return;
			}

			accounts.forEach((account) => {
				if (getEncodedAddress(account.address) === address) {
					setCanEdit(true);
				}
			});

			return;
		};

		getAccounts();

	}, [address]);

	useEffect(() => {

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.info(address, (info: DeriveAccountInfo) => {
			setIdentity(info.identity);
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		if (!address) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.flags(address, (result: DeriveAccountFlags) => {
			setFlags(result);
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	const judgements = identity ? identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid) : [];
	const displayJudgements = judgements.map(([,jud]) => jud.toString()).join(', ');
	const isGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
	const isBad = judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);

	const color: 'brown' | 'green' | 'grey' = isGood ? 'green' : isBad ? 'brown' : 'grey';
	const iconName = isGood ? 'check circle' : 'minus circle';

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>[]) => {setTitle(event[0].currentTarget.value); return event[0].currentTarget.value;};
	const onDescriptionChange = (data: Array<string>) => {setDescription(data[0]); return data[0].length ? data[0] : null;};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSend = async () => {
		const extensions = await web3Enable(APPNAME);

		if (!extensions || !extensions.length) {
			queueNotification({
				header: 'Failed',
				message: 'No web 3 account integration could be found. To be able to vote on-chain, visit this page on a computer with polkadot-js entension.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const accounts = await web3Accounts();

		if (accounts.length === 0) {
			queueNotification({
				header: 'Failed',
				message: 'You need at least one account in Polkadot-js extenstion to login.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		let injected: InjectedExtension | undefined = undefined;

		for (let i = 0; i < accounts.length; i++) {
			if (getEncodedAddress(accounts[i].address) === address) {
				injected = await web3FromSource(accounts[i].meta.source);
			}
		}

		if (!injected) {
			queueNotification({
				header: 'Failed',
				message: 'Address not available.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const signRaw = injected && injected.signer && injected.signer.signRaw;

		if (!signRaw) {
			queueNotification({
				header: 'Failed',
				message: 'Signer not available.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const signMessage = `<Bytes>about::network:${network}|address:${address}|title:${title || ''}|description:${description || ''}|image:</Bytes>`;

		console.log(signMessage);

		const { signature } = await signRaw({
			address,
			data: stringToHex(signMessage),
			type: 'bytes'
		});

		changeAboutMutation({
			variables: {
				address,
				description: description || '',
				image: '',
				network,
				signature,
				title: title || ''
			}
		}).then(({ data }) => {
			queueNotification({
				header: 'SUCCESS.',
				message: data?.changeAbout?.message || 'Profile Updated.',
				status: NotificationStatus.SUCCESS
			});
			setIsEditing(false);
			aboutQueryResult?.refetch();
		}).catch( e => console.error(e));
	};

	useEffect(() => {
		if (isEditing) {
			setValue('description', aboutDescription);
			setValue('title', aboutTitle);
		}
	}, [aboutDescription, isEditing, setValue, aboutTitle]);

	if (!apiReady) {
		return <Loader text={'Initializing Connection...'} />;
	}

	return (
		<Grid className={className}>
			<Grid.Column mobile={16} tablet={16} computer={10} largeScreen={10} widescreen={10}>
				{isEditing ? <Form className={className}>
					<h3>Update Profile</h3>
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
						name='description'
						onChange={onDescriptionChange}
						rules={{ required: true }}
					/>

					<div className={'mainButtonContainer'}>
						<Button
							primary
							onClick={handleSubmit(handleSend)}
							disabled={loading}
							type='submit'
						>
							{loading ? <><Icon name='spinner'/>Creating</> : 'Update'}
						</Button>
					</div>
					{error?.message && <FilteredError text={error.message}/>}
				</Form> : <div className="profile_content">
					{aboutQueryResult?.error ? <FilteredError className='info' text={aboutQueryResult?.error?.message}/> : null}
					{aboutQueryResult?.loading ? <Loader text={'Fetching Profile'}/> : <>
						<h2>{aboutQueryResult?.data?.about?.title || 'Title not edited'}</h2>
						<Markdown md={aboutQueryResult?.data?.about?.description || noDescription} />
						{canEdit ? <div className={'mainButtonContainer'}>
							<Button
								primary
								onClick={handleEdit}
								disabled={loading}
								type='submit'
							>
								{loading ? <><Icon name='spinner'/>Creating</> : 'Update'}
							</Button>
						</div> : null}
					</>}
				</div>}
			</Grid.Column>
			<Grid.Column mobile={16} tablet={16} computer={6} largeScreen={6} widescreen={6}>
				<div className='info-box'>
					<h2>{router.query.username}</h2>
					{address ? <>
						<div className="address-container">
							<AddressComponent address={address}/>
						</div>
						<Balance address={address} className='balance'/>
						{identity && <Table basic='very' celled collapsing>
							<Table.Body>
								{identity?.legal && <Table.Row>
									<Table.Cell className='desc'>Legal:</Table.Cell>
									<Table.Cell>{identity.legal}</Table.Cell>
								</Table.Row>}
								{identity?.email && <Table.Row>
									<Table.Cell className='desc'>Email:</Table.Cell>
									<Table.Cell><a href={`mailto:${identity.email}`}>{identity.email}</a></Table.Cell>
								</Table.Row>}
								{identity?.judgements?.length > 0 && <Table.Row>
									<Table.Cell className='desc'>Judgements:</Table.Cell>
									<Table.Cell className='judgments'><Icon name={iconName} color={color} /> {displayJudgements}</Table.Cell>
								</Table.Row>}
								{identity?.pgp && <Table.Row>
									<Table.Cell className='desc'>PGP:</Table.Cell>
									<Table.Cell>{identity.pgp}</Table.Cell>
								</Table.Row>}
								{identity?.riot && <Table.Row>
									<Table.Cell className='desc'>Riot:</Table.Cell>
									<Table.Cell>{identity.riot}</Table.Cell>
								</Table.Row>}
								{identity?.twitter && <Table.Row>
									<Table.Cell className='desc'>Twitter:</Table.Cell>
									<Table.Cell><a href={`https://twitter.com/${identity.twitter.substring(1)}`}>{identity.twitter}</a></Table.Cell>
								</Table.Row>}
								{identity?.web && <Table.Row>
									<Table.Cell className='desc'>Web:</Table.Cell>
									<Table.Cell>{identity.web}</Table.Cell>
								</Table.Row>}
								{flags?.isCouncil && <Table.Row>
									<Table.Cell className='desc'>Roles:</Table.Cell>
									<Table.Cell>Council member <CouncilEmoji/></Table.Cell>
								</Table.Row>}
							</Table.Body>
						</Table>}
					</> : <p>No address attached to this account</p>}
				</div>
			</Grid.Column>
		</Grid>
	);
};

export default styled(Profile)`
	.profile_content {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		padding: 3rem 3rem 0.8rem 3rem;
		margin-bottom: 1rem;
	}

	.info-box {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		width: calc(100% - 60px);
		word-break: break-word;
		padding: 10px;
		text-align: center;
		display: flex;
		align-items: center;
		flex-direction: column;

		@media only screen and (max-width: 576px) {
			width: 100%;
			border-radius: 0px;
		}
	}

	.address-container {
		margin: 10px 0;
	}

	.desc {
		font-weight: bold;
	}

	.mainButtonContainer{
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 3rem;
	}
`;
