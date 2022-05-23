// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-image-crop/dist/ReactCrop.css';

import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactCrop, {
	centerCrop,
	Crop,
	makeAspectCrop,
	PixelCrop
} from 'react-image-crop';
import { Button, Card, Divider, Form, Grid, Icon, Input, Label, Message, Modal, TextArea } from 'semantic-ui-react';
import { NotificationContext } from 'src/context/NotificationContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { GetUserDetailsQuery, useAddProfileMutation, useGetUserDetailsQuery } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import Loader from 'src/ui-components/Loader';

import { canvasPreview } from './canvasPreview';

interface Props {
	className?: string
}

const UserProfile = ({ className }: Props): JSX.Element => {
	const { id, username } = useContext(UserDetailsContext);
	const { queueNotification } = useContext(NotificationContext);

	const [bio, setBio] = useState<string>('');
	const [userImage, setUserImage] = useState<string>('');
	const [editProfile, setEditProfile] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('aaa');
	const [badges, setBadges] = useState<string[]>([]);
	const [newBadge, setNewBadge] = useState<string>('');
	const [profilePhotoDataUrl, setProfilePhotoDataUrl] = useState<string>('');

	const [newBadgeError, setNewBadgeError] = useState<boolean>(false);

	const [openModal, setOpenModal] = useState<boolean>(false);
	const [imgSrc, setImgSrc] = useState('');
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { data, error, refetch } = useGetUserDetailsQuery({
		variables: {
			user_id: Number(id)
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	function populateState(data: GetUserDetailsQuery) {
		if(data?.userDetails) {
			setBio(`${data.userDetails.bio}`);
			setUserImage(`${data.userDetails.image}`);
			setTitle(`${data.userDetails.title}`);
			if (data.userDetails.badges) {
				setBadges(JSON.parse(data.userDetails.badges));
			}
		}
	}

	useEffect(() => {
		if(data?.userDetails) {
			populateState(data);
		}
	}, [data]);

	// reset edit form on cancel edit
	useEffect(() => {
		if(!editProfile){
			if(data?.userDetails) {
				populateState(data);
			}else{
				setBio('');
				setUserImage('');
				setTitle('');
				setBadges([]);
			}

			//reset form
			setNewBadge('');
			setProfilePhotoDataUrl('');
			setNewBadgeError(false);
			setOpenModal(false);
			setImgSrc('');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editProfile]);

	const addNewBadge = () => {
		if(!newBadge || loadingUpdate){
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

	function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setCompletedCrop(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			reader.addEventListener('load', () =>
				setImgSrc(reader.result?.toString() || '')
			);
			reader.readAsDataURL(e.target.files[0]);
			setOpenModal(true);
		}
	}

	useEffect(() => {
		if(openModal == false && fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [openModal]);

	const fileInputButton = editProfile && <input id='hello' ref={fileInputRef} type="file" className="custom-file-input" onChange={onSelectFile}></input>;

	function centerAspectCrop(
		mediaWidth: number,
		mediaHeight: number,
		aspect: number
	) {
		return centerCrop(
			makeAspectCrop(
				{
					unit: '%',
					width: 90
				},
				aspect,
				mediaWidth,
				mediaHeight
			),
			mediaWidth,
			mediaHeight
		);
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const { width, height } = e.currentTarget;
		setCrop(centerAspectCrop(width, height, 1));
	}

	useEffect(() => {
		if (
			completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
		) {
			// We use canvasPreview as it's much faster than imgPreview.
			canvasPreview(
				imgRef.current,
				previewCanvasRef.current,
				completedCrop
			);
		}
	}, [completedCrop]);

	const updateProfileImage = () => {
		if(previewCanvasRef.current) {
			setProfilePhotoDataUrl(previewCanvasRef.current.toDataURL('image/jpeg', 0.5));
			setOpenModal(false);
		}
	};

	const [addProfileMutation, { error: errorUpdate, loading: loadingUpdate }] = useAddProfileMutation({
		variables: {
			badges: JSON.stringify(badges),
			bio: bio,
			image: profilePhotoDataUrl,
			title: title,
			user_id: Number(id)
		}
	});

	const updateProfileData = () => {
		console.log('profilePhotoDataUrl : ', profilePhotoDataUrl);
		addProfileMutation({
			variables: {
				badges: JSON.stringify(badges),
				bio: bio,
				image: profilePhotoDataUrl.length > 1 ? profilePhotoDataUrl : `${data?.userDetails?.image}`,
				title: title,
				user_id: Number(id)
			}
		}).then(({ data }) => {
			if (data?.addProfile && data?.addProfile?.message){
				refetch();
				setEditProfile(false);
				queueNotification({
					header: 'Success!',
					message: 'Your profile was updated.',
					status: NotificationStatus.SUCCESS
				});
			}
		})
			.catch((e) => console.error('Error updating profile: ',e));
	};

	return (
		id ? <Grid stackable className={className}>

			<Modal
				open={openModal}
				className={className}
			>
				<Modal.Header>Please crop your photo</Modal.Header>
				<Modal.Content>

					<div className='modal-content-div'>
						<div className='cropper-div'>
							<ReactCrop
								crop={crop}
								onChange={(_, percentCrop) => setCrop(percentCrop)}
								onComplete={(c) => setCompletedCrop(c)}
								aspect={1}
								minHeight={130}
								minWidth={130}
							>
								<img
									ref={imgRef}
									alt="Crop image"
									src={imgSrc}
									onLoad={onImageLoad}
								/>
							</ReactCrop>

						</div>

						<div className='img-preview-div'>
							<h6 style={ { marginBottom: '12px' } }>Preview :</h6>
							{Boolean(completedCrop) && (
								<canvas
									ref={previewCanvasRef}
									style={{
										border: '1px solid black',
										borderRadius: '50%',
										height: '130px',
										objectFit: 'contain',
										width: '130px'
									}}
								/>
							)}
						</div>
					</div>

				</Modal.Content>
				<Modal.Actions>
					<Button
						onClick={() => setOpenModal(false)}
					>
							Cancel
					</Button>
					<Button
						content="Crop"
						labelPosition='right'
						icon='expand'
						onClick={updateProfileImage}
						positive
						disabled={!previewCanvasRef.current}
					/>
				</Modal.Actions>
			</Modal>

			<Grid.Column width={16}>
				<h1>Profile</h1>
			</Grid.Column>
			{ data && !error ?
				<Grid.Column className='profile-card' mobile={16} tablet={16} computer={15} largeScreen={15} widescreen={15}>

					<Grid stackable>
						{(errorUpdate && editProfile) && <Grid.Column className='profile-col' width={16}>
							<Message negative>
								<p>{errorUpdate.message}</p>
							</Message>
						</Grid.Column>}

						<Grid.Column className='profile-col' width={16}>
							<div className='profile-div'>
								{userImage || profilePhotoDataUrl ?
									<div className='image-div'>
										<img width={130} height={130} className='profile-img' src={profilePhotoDataUrl ? profilePhotoDataUrl : userImage} />
										{!loadingUpdate ? fileInputButton : <Button basic loading>Loading</Button>}
									</div>
									: <div className='no-image-div'>
										<Icon className='no-image-icon' name='user circle' />
										{!loadingUpdate ? fileInputButton : <Button basic loading>Loading</Button>}
									</div>
								}

								<div className={`profile-text-div ${editProfile ? 'editing' : ''}`}>
									{ username && <h3 className='display-name'>{username}</h3>}

									{editProfile ? <Input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} disabled={loadingUpdate} /> :
										title ? <h3 className='display-title'>{title}</h3> :
											<h3 className='no-display-title'>No title added</h3>
									}

									{ editProfile &&
										<>
											{ newBadgeError && <span className='error-text'>This badge already exists.</span> }
											<Input placeholder='New Badge' onChange={(e) => setNewBadge(e.target.value)} value={newBadge} disabled={loadingUpdate} action={{ icon: 'add', onClick: addNewBadge }} error={newBadgeError} />
										</>
									}
									{ badges.length > 0 ?
										<Label.Group className={`display-badges ${editProfile ? 'editing' : ''}`} size='big'>
											{badges.map((badge, i) => (<Label key={i}>{badge}{editProfile ? <Icon disabled={loadingUpdate} onClick={() => removeBadge(badge)} name='delete' /> : null}</Label>))}
										</Label.Group> :
										<h3 className='no-display-title'>No badges added</h3>
									}
								</div>
							</div>
							<Button basic size='large' className='edit-profile-btn' disabled={loadingUpdate} onClick={() => { setEditProfile(!editProfile);} }> <Icon name={`${ editProfile ? 'close' : 'pencil'}`} /> {`${ editProfile ? 'Cancel Edit' : 'Edit Profile'}`}</Button>
						</Grid.Column>
					</Grid>

					{editProfile ?
						<>
							<Divider className='profile-divider' />
							<div className='about-div'>
								<h2>About</h2>
								<Form>
									<TextArea rows={6} placeholder='Please add your bio here...' disabled={loadingUpdate} onChange={(e) => setBio((e.target as HTMLInputElement).value)} value={bio} />
								</Form>

								<Button className='update-button' size='big' disabled={loadingUpdate} loading={loadingUpdate} onClick={updateProfileData}>
									Update
								</Button>
							</div>
						</>
						:bio ?
							<>
								<Divider className='profile-divider' />
								<div className='about-div'>
									<h2>About</h2>
									<p>{bio}</p>
								</div>
							</>
							:
							<>
								<Divider className='profile-divider' />
								<div className='no-about-div'>
									<p>Please click on &apos;Edit Profile&apos; to add a bio.</p>
								</div>
							</>
					}
				</Grid.Column>
				:
				<Loader />
			}
		</Grid>
			:
			<Grid stackable className={className}>
				<Grid.Column width={16}>
					<Card fluid header='Please login to access profile.' />
				</Grid.Column>
			</Grid>
	);
};

export default styled(UserProfile)`

	h1 {
		font-size: 48px;
		font-weight: 400;
		margin-bottom: 16px !important;
	}


	.message {
		width: 100%;
		margin-bottom: 16px;
	}

	.modal-content-div{
		display: flex;

		@media only screen and (max-width: 767px) {
			flex-direction: column;
		}

		.cropper-div {
			width: 80%;

			@media only screen and (max-width: 767px) {
				width: 100%;
			}
		}

		.img-preview-div {
			margin-left: 16px;

			@media only screen and (max-width: 767px) {
				margin-top: 16px;
				text-align: center;
			}
		}
	}

	.profile-card {
		background-color: white;
		padding: 24px !important;
		border-radius: 10px;
		box-shadow: box_shadow_card;

		.profile-div {
			@media only screen and (min-width: 767px) {
				display: flex;
			}

			.profile-img {
				border-radius: 50%;
			}

			.image-div {
				.custom-file-input, button {
					margin-top: 12px;
				}
			}

			.no-image-div, .image-div {
				display: flex;
				flex-direction: column;
				align-items: center;

				.no-image-icon {
					font-size: 130px !important;
					margin-top: 50px;
					margin-bottom: -48px;
					color: #778192;
				}
			}

			.custom-file-input {
				z-index: 50;
				width: 137px;
				overflow: none;
			}

			.custom-file-input::-webkit-file-upload-button {
				visibility: hidden;
			}
			.custom-file-input::before {
				content: 'Update Profile Photo';
				display: inline-block;
				background: #fff;
				border: 1px solid #999;
				border-radius: 3px;
				padding: 5px 8px;
				outline: none;
				white-space: nowrap;
				-webkit-user-select: none;
				user-select: none;
				cursor: pointer;
				text-shadow: 1px 1px #fff;
				font-weight: 700;
				font-size: 12px;
			}
			.custom-file-input:hover::before {
				border-color: black;
			}

		}


		.profile-text-div {
			@media only screen and (min-width: 767px) {
				margin-left: 24px;
			}

			&.editing {
				display: flex;
				flex-direction: column;

				.input {
					margin-bottom: 16px;
					width: 100%;
					max-width: 400px;

					@media only screen and (max-width: 767px) {
						margin-left: auto;
						margin-right: auto;
					}

					.button {
						padding: 0 16px;
					}
				}

				.error-text {
					color: #B83A38;
					font-size: 12px;
				}
			}
		}

		.profile-col {
			display: flex !important;
			justify-content: space-between;

			@media only screen and (max-width: 767px) {
				text-align: center;
				flex-direction: column;
				margin-left: 0;
			}

			h3 {
				font-weight: 500;
			}
			
			h3.display-name {
				margin-top: 1rem;
				font-size: 22px;
			}

			h3.display-title, h3.no-display-title {
				font-size: 18px;
				color: #7D7D7D;
				margin-top: 16px;
				text-transform: capitalize;
			}

			h3.no-display-title {
				font-size: 16px;
				text-transform: none;
			}

			.display-badges {
				margin-top: 26px;
				text-transform: capitalize !important;

				&.editing {
					margin-top: 0;
				}

				.label {
					border-radius: 48px;
					background: #E5007A;
					color: #fff;
					font-size: 14px;
					font-weight: 500;
					text-transform: capitalize !important;
				}
			}

			.edit-profile-btn {
				border-radius: 5px;
				border: 1px solid #8D8D8D;
				height: 40px;
				font-size: 14px;
    		white-space: nowrap;

				@media only screen and (max-width: 767px) {
					margin-top: 16px;
				}
			}
		}

		.profile-divider {
			margin-top: 3.5em;
		}

		.about-div, .no-about-div {
			margin: 1.4em 0.5em;

			h2 {
				font-weight: 500;
				font-size: 22px;
			}

			p, textarea {
				font-weight: 400;
				font-size: 16px;
				line-height: 24px;
				color: #7D7D7D !important;
			}

			.update-button {
				background-color: #E5007A;
				color: #fff;
				margin-top: 16px;
				float: right;
			}
		}

		.no-about-div {
			text-align: center;
			margin-bottom: -4px;
		}
}
`;
