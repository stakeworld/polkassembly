// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Grid, Icon, TextArea } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetUserDetailsQuery } from 'src/generated/graphql';
import Loader from 'src/ui-components/Loader';

interface Props {
	className?: string
}

const UserProfile = ({ className }: Props): JSX.Element => {
	const { id, username } = useContext(UserDetailsContext);
	const [bio, setBio] = useState<string>('');
	const [userImage, setUserImage] = useState<string>('');
	const [editProfile, setEditProfile] = useState<boolean>(false);

	const { data, error } = useGetUserDetailsQuery({
		variables: {
			user_id: Number(id)
		}
	});

	console.log('data : ', data);
	console.log('error : ', error);

	// TODO: Enable
	// useEffect(() => {
	// refetch();
	// }, [refetch]);

	useEffect(() => {
		if(data?.userDetails) {
			setBio(`${data.userDetails.bio}`);
			setUserImage(`${data.userDetails.image}`);
		}
	}, [data]);

	return (
		id ? <Grid stackable className={className}>
			<Grid.Column width={16}>
				<h1>Profile</h1>
			</Grid.Column>
			{ data && !error ?
				<Grid.Column className='profile-card' mobile={16} tablet={16} computer={15} largeScreen={15} widescreen={15}>

					<Grid stackable>
						<Grid.Column className='profile-col' width={16}>
							<div className='profile-div'>
								{userImage ?
									<img width={130} height={130} className='profile-img' src={`data:image/png;base64,${userImage}`} />
									: <Icon name='user circle' />
								}
								<div className='profile-text-div'>
									{ username && <h3 className='display-name'>{username}</h3>}
									{/* <h3 className='display-title'>Display Title</h3> */}
									{/* <Label.Group className='display-badges' size='big'>
											<Label>Fun</Label>
											<Label>Happy</Label>
											<Label>Smart</Label>
											<Label>Witty</Label>
										</Label.Group> */}
								</div>
							</div>
							<Button basic size='large' className='edit-profile-btn' onClick={() => { setEditProfile(!editProfile);} }> <Icon name={`${ editProfile ? 'close' : 'pencil'}`} /> {`${ editProfile ? 'Cancel Edit' : 'Edit Profile'}`}</Button>
						</Grid.Column>
					</Grid>

					{editProfile ?
						<>
							<Divider className='profile-divider' />
							<div className='about-div'>
								<h2>About</h2>
								<Form>
									<TextArea rows={6} placeholder='Please add your bio here...' />
								</Form>

								<Button className='update-button' size='big'>
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
		margin-bottom: 36px;
	}

	.profile-card {
		background-color: white;
		padding: 24px !important;
		border-radius: 10px;
		box-shadow: box_shadow_card;

		.profile-div {
			.profile-img {
				border-radius: 50%;
			}

			.icon {
				font-size: 130px !important;
				margin-top: 50px;
				margin-bottom: -48px;
				color: #778192;
			}
		}


		.profile-text-div {
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
		}

		.profile-col {
			display: flex !important;
			justify-content: center;

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

			h3.display-title {
				font-size: 18px;
				color: #7D7D7D;
				margin-top: 16px;
			}

			.display-badges {
				margin-top: 26px;

				.label {
					border-radius: 48px;
					background: #E5007A;
					color: #fff;
					font-size: 14px;
					font-weight: 500;
				}
			}

			.edit-profile-btn {
				border-radius: 5px;
				border: 1px solid #8D8D8D;
				height: 40px;
				position: absolute;
				right: 0;
				font-size: 14px;

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
