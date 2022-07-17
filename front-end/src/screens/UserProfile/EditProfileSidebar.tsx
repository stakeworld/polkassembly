// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloQueryResult } from 'apollo-client';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Icon, Input, Label, Message, Modal, TextArea } from 'semantic-ui-react';
import { NotificationContext } from 'src/context/NotificationContext';
import { Exact, GetUserDetailsQuery, useAddProfileMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';

import noUserImage from '../../assets/no-user-img.png';

interface Props {
  className?: string
	routeWrapperHeight: number
	setEditProfileSidebar: React.Dispatch<React.SetStateAction<boolean>>
	refetch: (variables?: Exact<{
    user_id: number;
	}> | undefined) => Promise<ApolloQueryResult<GetUserDetailsQuery>>
	id:  number | null | undefined
	data?: GetUserDetailsQuery
}

const EditProfileSidebar = ({ className, data, routeWrapperHeight, refetch, setEditProfileSidebar, id }: Props) => {

	const [title, setTitle] = useState<string>('aaa');
	const [badges, setBadges] = useState<string[]>([]);
	const [bio, setBio] = useState<string>('');
	const [newBadge, setNewBadge] = useState<string>('');
	const [userImage, setUserImage] = useState<string>('');
	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	const [openModal, setOpenModal] = useState<boolean>(false);
	const [imgUrl, setImgUrl] = useState<string>('');
	const [finalImgUrl, setFinalImgUrl] = useState<string>('');

	const [newBadgeError, setNewBadgeError] = useState<boolean>(false);
	const [imageUrlError, setImageUrlError] = useState<boolean>(false);

	const { queueNotification } = useContext(NotificationContext);

	useEffect(() => {
		if(data?.userDetails) {
			populateState(data);
		}else{
			setBio('');
			setUserImage('');
			setTitle('');
			setBadges([]);
		}
	}, [data]);

	function populateState(data: GetUserDetailsQuery) {
		if(data?.userDetails) {
			setBio(`${data.userDetails.bio}`);
			setUserImage(`${data.userDetails.image}`);
			setImgUrl(`${data.userDetails.image}`);
			setFinalImgUrl(`${data.userDetails.image}`);
			setTitle(`${data.userDetails.title}`);
			if (data.userDetails.badges) {
				setBadges(JSON.parse(data.userDetails.badges));
			}
		}
	}

	const [addProfileMutation, { error, loading }] = useAddProfileMutation({
		variables: {
			badges: JSON.stringify(badges),
			bio: bio,
			image: finalImgUrl,
			title: title,
			user_id: Number(id)
		}
	});

	const closeEditProfileSidebar = () => {
		setEditProfileSidebar(false);
		setTitle('');
		setBadges([]);
		setNewBadge('');
		setBio('');
		setUserImage('');
		setErrorsFound([]);
	};

	const confirmProfileImage = () => {
		// eslint-disable-next-line no-useless-escape
		const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
		if(imgUrl.match(regex)) {
			setFinalImgUrl(imgUrl);
			setOpenModal(false);
		}else {
			setImageUrlError(true);
		}
	};

	const updateProfileData = () => {
		addProfileMutation({
			variables: {
				badges: JSON.stringify(badges),
				bio: bio,
				image: finalImgUrl,
				title: title,
				user_id: Number(id)
			}
		}).then(({ data }) => {
			if (data?.addProfile && data?.addProfile?.message){
				refetch();
				setEditProfileSidebar(false);
				queueNotification({
					header: 'Success!',
					message: 'Your profile was updated.',
					status: NotificationStatus.SUCCESS
				});
			}
		}).catch((e) => {
			console.error('Error updating profile: ',e);
			queueNotification({
				header: 'Error!',
				message: 'Your profile was not updated.',
				status: NotificationStatus.ERROR
			});
		});
	};

	const addNewBadge = () => {
		if(!newBadge || loading){
			return;
		}

		if(!(badges.includes(newBadge.toLowerCase()))) {
			setBadges([...badges, newBadge.toLowerCase()]);
			setNewBadge('');
			setNewBadgeError(false);
		}else {
			setNewBadgeError(true);
		}
	};

	function removeBadge(badge:string){
		const badgesArr = [...badges];
		const index = badgesArr.indexOf(badge);
		if (index !== -1) {
			badgesArr.splice(index, 1);
			setBadges(badgesArr);
		}
	}

	function handleNewBadgeKeyPress(e:any) {
		if(e.key === 'Enter'){
			e.preventDefault();
			addNewBadge();
		}
	}

	const updatePhotoButton = <Button basic className='upload-photo-btn' disabled={loading} loading={loading} onClick={() => { setImageUrlError(false); setOpenModal(true);}} icon={loading ? 'spinner' : 'photo'} />;

	return (
		<div className={className} style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>

			<Modal
				open={openModal}
				className={className}
				size='tiny'
			>
				<Modal.Header style={ { fontSize: '16px' } }>Please input the URL for your photo</Modal.Header>
				<Modal.Content className='modal-content' style={ { fontSize: '13px' } }>
					<p><b>Instructions : </b>Please provide a url of your profile photo using a service such as <a href='https://postimages.org/' target='_blank' rel="noreferrer">postimages.org</a> to upload and generate a direct link.</p>
					<p><i>Please remember to copy the direct link.</i></p>

					<Input
						className='profile-link-input'
						size='large'
						type='url'
						icon='linkify'
						iconPosition='left'
						placeholder='Profile Picture URL'
						onChange={(e) => setImgUrl(e.target.value)}
						value={imgUrl}
						disabled={loading}
						style={ { width: '100%' } }
					/>

					{(imageUrlError) &&
							<Message negative>
								<p>Please ensure the input is a valid link.</p>
							</Message>
					}
				</Modal.Content>
				<Modal.Actions>
					<Button
						onClick={() => { setImgUrl(`${data?.userDetails?.image}`); setOpenModal(false);}}
					>
									Cancel
					</Button>
					<Button
						content="Confirm"
						labelPosition='right'
						icon='photo'
						onClick={confirmProfileImage}
					/>
				</Modal.Actions>
			</Modal>

			<div className="edit-profile-sidebar-header d-flex">
				<h1>Edit Profile <Button onClick={closeEditProfileSidebar} disabled={loading} icon='close' /></h1>
			</div>

			{error && <Grid.Column className='profile-col' width={16}>
				<Message negative>
					<p>{error.message}</p>
				</Message>
			</Grid.Column>}

			<div className='profile-image'>
				{userImage || finalImgUrl ?
					<div className='image-div'>
						<img width={130} height={130} className='profile-img' src={finalImgUrl ? finalImgUrl : userImage} />
						{updatePhotoButton}
					</div>
					: <div className='no-image-div'>
						<img width={130} height={130} className='profile-img' src={noUserImage} />
						{updatePhotoButton}
					</div>
				}
			</div>

			<div className="edit-profile-form">
				<Form>
					<Form.Field>
						<label className='input-label'>Job Title</label>
						<Input
							type='text'
							className='text-input'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							error={errorsFound.includes('eventTitle')}
							disabled={loading}
						/>
					</Form.Field>

					<Form.Field>
						<label className='input-label'>Bio</label>
						<TextArea
							rows={4}
							className='textarea-input text-input'
							disabled={loading}
							onChange={(e) => setBio((e.target as HTMLInputElement).value)}
							value={bio}
							error={errorsFound.includes('bio')}
						/>
					</Form.Field>

					<Form.Field>
						<label className='input-label'>Badges</label>
						<p className='info-para'>Badges are pointers that indicate individual successes, abilities, skills and/or interests.</p>
						<div className="d-flex">
							<Input
								type='text'
								className='text-input mb-0'
								value={newBadge}
								onChange={(e) => setNewBadge(e.target.value)}
								onKeyPress={(e: any) => handleNewBadgeKeyPress(e)}
								disabled={loading}
							/>
							<Button className='add-badge-btn' onClick={() => addNewBadge()}><Icon name='plus' /><span className='badge-btn-text'>Add Badge</span></Button>
						</div>
						{ newBadgeError && <span className='error-text'>This badge already exists.</span> }

						{ badges.length > 0 &&
							<Label.Group className='display-badges' size='big'>
								{badges.map((badge, i) => (<Label key={i}>{badge}<Icon disabled={loading} onClick={() => removeBadge(badge)} name='delete' /></Label>))}
							</Label.Group>
						}
					</Form.Field>

					<div className="form-actions">
						<Button content='Cancel' onClick={closeEditProfileSidebar} disabled={loading} />
						<Button content='Update Profile' className='submit-btn' disabled={loading} loading={loading} onClick={updateProfileData} />
					</div>
				</Form>
			</div>
		</div>
	);
};

export default EditProfileSidebar;
