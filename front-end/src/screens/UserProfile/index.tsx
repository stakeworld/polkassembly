// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext, useState } from 'react';
import { Button, Card, Divider, Grid, Icon, Label } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetUserDetailsQuery } from 'src/generated/graphql';
import Loader from 'src/ui-components/Loader';

import noUserImage from '../../assets/no-user-img.png';
import EditProfileSidebar from './EditProfileSidebar';

interface Props {
	className?: string
}

const UserProfile = ({ className }: Props): JSX.Element => {
	// calculate #route-wrapper height with margin for sidebar.
	const routeWrapperEl = document.getElementById('route-wrapper');
	let routeWrapperHeight = routeWrapperEl?.offsetHeight;
	if(routeWrapperEl && routeWrapperHeight) {
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-top'));
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-bottom'));
	}

	const { id, username } = useContext(UserDetailsContext);
	const [editProfile, setEditProfile] = useState<boolean>(false);

	const { data, error, refetch } = useGetUserDetailsQuery({
		variables: {
			user_id: Number(id)
		}
	});

	// TODO: remove
	// useEffect(() => {
	// refetch();
	// }, [refetch]);

	return (
		<div className={className}>
			{
				id ? <Grid stackable>

					{ data && !error ?
						<Grid.Column className='profile-card' mobile={16} tablet={16} computer={15} largeScreen={15} widescreen={15}>

							<Grid stackable>
								<Grid.Column className='profile-col' width={16}>
									<div className='profile-div'>
										{data.userDetails?.image ?
											<div className='image-div'>
												<img width={130} height={130} className='profile-img' src={data.userDetails?.image} />
											</div>
											: <div className='no-image-div'>
												<img width={130} height={130} className='profile-img' src={noUserImage} />
											</div>
										}

										<div className='profile-text-div'>
											{ username && <h3 className='display-name'>{username}</h3>}

											{data.userDetails?.title ? <h3 className='display-title'>{data?.userDetails?.title}</h3> :
												<h3 className='no-display-title'>No Job Title Added</h3>
											}

											{ data.userDetails?.badges && JSON.parse(data.userDetails?.badges).length > 0 ?
												<Label.Group className='display-badges' size='big'>
													{JSON.parse(data.userDetails?.badges).map((badge:string, i: number) => (<Label key={i}>{badge}</Label>))}
												</Label.Group> :
												<Label.Group className='display-badges editing dummy-badges' size='big'>
													<Label><div className='small'></div></Label>
													<Label><div></div></Label>
												</Label.Group>
											}
										</div>
									</div>
									<Button basic size='large' className='edit-profile-btn' onClick={() => { setEditProfile(!editProfile);} }> <Icon name={`${ editProfile ? 'close' : 'pencil'}`} /> {`${ editProfile ? 'Cancel Edit' : 'Edit Profile'}`}</Button>
								</Grid.Column>
							</Grid>

							{data.userDetails?.bio ?
								<>
									<Divider className='profile-divider' />
									<div className='about-div'>
										<h2>About</h2>
										<p>{data.userDetails?.bio}</p>
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
			}

			{/* Create Event Sidebar */}
			{routeWrapperHeight && editProfile &&
				<EditProfileSidebar
					setEditProfileSidebar={setEditProfile}
					refetch={refetch}
					routeWrapperHeight={routeWrapperHeight}
					className='edit-profile-sidebar'
					id={id}
					data={data}
				/>
			}
		</div>
	);
};

export default styled(UserProfile)`

	h1 {
		font-size: 48px;
		font-weight: 400;
		margin-bottom: 16px !important;
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

			.no-image-div, .image-div {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.upload-photo-btn {
				z-index: 50;
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

	.edit-profile-sidebar {
		position: absolute;
		right: 0;
		top: 6.5rem;
		background: #fff;
		z-index: 100;
		padding: 40px 24px;
		box-shadow: -5px 0 15px -12px #888;
		overflow-y: auto;
		min-width: 350px !important;
		width: 610px !important;
		max-width: 60vw !important;

		@media only screen and (max-width: 768px) {
			top: 0;
			padding: 40px 14px;
			padding-top: 70px;
			overflow-y: auto;
			min-width: 250px !important;
			max-width: 90vw !important;

			h1 {
				margin-top: 0;
			}

			.sidebar-event-content {
				padding-right: 10px;
			}
		}

		.d-flex {
			display: flex !important;
		}

		.edit-profile-sidebar-header {
			h1 {
				display: flex;
				justify-content: space-between;
				width: 100%;
				font-weight: 500;
				font-size: 28px !important;
				
				.button {
					border-radius: 50%;
				}
			}

			@media only screen and (max-width: 768px) {
				h1 {
					font-size: 24px !important;
				}
			}
		}
		
		.profile-image {
			.profile-img {
					border-radius: 50%;
			}
	
			.no-image-div, .image-div {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
			}
	
			.upload-photo-btn {
				z-index: 50;
				font-size: 15px;
				border-radius: 50%;
				background-color: #fff !important;
				color: #000 !important;
				margin-left: -40px;
				margin-bottom: 10px !important;
			}
		}

		.edit-profile-form {
			margin-top: 48px;

			@media only screen and (max-width: 768px) {
				margin-top: 18px;
			}

			.input.error {
				border: 1px solid #FF0000;
			}

			.input-label {
				font-weight: 500;
				font-size: 16px;
				color: #7D7D7D;
				margin-bottom: 6px;

				@media only screen and (max-width: 768px) {
					font-size: 16px;
				}
			}

			.info-para {
				font-size: 14px;
				color: #B5B5B5;
			}
			
			.text-input {
				height: 40px;
				border-radius: 5px;
				margin-bottom: 18px;
				font-size: 14px;

				@media only screen and (max-width: 768px) {
					font-size: 14px;
					height: 38px;
					margin-bottom: 12px;
				}
			}

			.textarea-input {
				height: auto !important;
			}

			.radio-input-group {
				margin-top: 12px;
				
				.checkbox{
					margin-right: 20px !important;

					&.checked {
						label {
							color: #E5007A;

							&::after {
								background-color: #E5007A !important;
							}
						}
					}

					label {
						font-size: 18px !important;
						padding-left: 20px !important;
					}

				}
			}

			.date-input-row {
				margin-top: 28px;
				margin-bottom: 28px;
				display: flex;

				@media only screen and (max-width: 768px) {
					margin-top: 22px;
					margin-bottom: 22px;
					flex-direction: column;
				}

				.start-date-div {
					margin-right: 20px;

					@media only screen and (max-width: 768px) {
						margin-right: 0;
						margin-bottom: 14px;
					}
				}

				.input-label {
					margin-bottom: 212px !important;
				}

				.react-calendar__tile--now {
					background-color: rgba(229, 0, 122, 0.1);
				}
			}

			.date-input {
				width: 100%;
				margin-top: 2px;
				font-family: 'Roboto' !important;
		
				&.error {
					.react-date-picker__wrapper {
						border: #FF0000 1px solid;
						color: #FF0000 !important;
					}
		
					.react-date-picker__inputGroup__input {
						color: #FF0000 !important;
						font-family: 'Roboto' !important;
					}
				}
		
				.react-date-picker__wrapper {
					padding: 0 10px;
					border: 1px solid rgba(34,36,38,.15);
					border-radius: .29rem;
		
					.react-date-picker__inputGroup {
						display: flex;
		
						.react-date-picker__inputGroup__divider {
							height: 100%;
							display: flex;
							align-items: center;
						}
					}
		
				}
		
				.react-date-picker__clear-button {
					svg {
						stroke: #aaa !important;
						height: 14px;
					}
				}
		
				.react-date-picker__inputGroup__input {
					border: none !important;
					font-family: 'Roboto' !important;
					color: #333;
					height: min-content;
					margin-bottom: 0 !important;
				}
		
				.react-date-picker__inputGroup__divider,.react-date-picker__inputGroup__day, .react-date-picker__inputGroup__month, .react-date-picker__inputGroup__year {
					font-size: 14px;
					padding-left: 1px !important;
					padding-right: 1px !important;
				}
			}

			.form-actions{
				display: flex;
				justify-content: flex-end;
				margin-top: 16px;

				.button {
					font-weight: 600;
					font-size: 16px;

					&:first-of-type {
						background: transparent;
					}
				}

				.submit-btn {
					background: #E5007A;
					color: #fff;
				}
				
			}
		}
	}

	.display-badges {
		margin-top: 26px;
		text-transform: capitalize !important;

		&.editing {
			margin-top: 0;

			&.dummy-badges {
				.label {
					background: #ddd;
					color: #ddd;
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-khtml-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;

					div {
						width: 64px !important;
						height: 6px;
						margin: 2.5px 6px;
						background: #bbb;
						border-radius: 3px;
						&.small {
							width: 34px !important;
						}
					}
				}
			}
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
`;
