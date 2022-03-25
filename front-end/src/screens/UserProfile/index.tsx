// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { Button, Divider, Grid, Icon, Label } from 'semantic-ui-react';
// import CouncilVotes from '././CouncilVotes';

interface Props {
	className?: string
}

const UserProfile = ({ className }: Props): JSX.Element => {

	return (
		<Grid stackable>
			<Grid.Column width={15}>
				<h1 style={ { fontSize: '4.4rem', fontWeight: 500 } }>Profile</h1>
			</Grid.Column>
			<Grid.Column className={className} mobile={16} tablet={16} computer={15} largeScreen={15} widescreen={15}>
				{/* First Row */}
				<Grid stackable>
					<Grid.Column className='profile-photo-col' mobile={16} tablet={16} computer={16} largeScreen={2} widescreen={2}>
						<img width={130} height={130} className='profile-img' src='https://image.shutterstock.com/image-vector/august-20-2014-illustration-robocop-600w-216216121.jpg' />
					</Grid.Column>
					<Grid.Column className='profile-text-col' mobile={16} tablet={12} computer={12} largeScreen={10} widescreen={10}>
						<h3 className='display-name'>Display Name</h3>
						<h3 className='display-title'>Display Title</h3>
						<Label.Group className='display-badges' size='big'>
							<Label>Fun</Label>
							<Label>Happy</Label>
							<Label>Smart</Label>
							<Label>Witty</Label>
						</Label.Group>
					</Grid.Column>
					<Grid.Column className='profile-edit-col' mobile={16} tablet={3} computer={3} largeScreen={2} widescreen={2}>
						<Button basic> <Icon name='pencil' /> Standard</Button>
					</Grid.Column>
				</Grid>
				{/* End First Row */}
				<Divider className='profile-divider' />
				<div className='about-div'>
					<h2>About</h2>

					<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi parturient diam, gravida vitae lobortis. Facilisis nisl enim pellentesque pellentesque sed tristique. Ullamcorper dapibus pharetra, libero aliquet id viverra adipiscing odio viverra. Turpis orci id nec, auctor ac venenatis sed mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisi parturient diam, gravida vitae lobortis. Facilisis nisl enim pellentesque pellentesque sed tristique. Ullamcorper dapibus pharetra, libero aliquet id viverra adipiscing odio viverra. Turpis orci id nec, auctor ac venenatis sed mauris.
					</p>
				</div>
			</Grid.Column>
		</Grid>
	);
};

export default styled(UserProfile)`
	background-color: white;
	padding: 2rem 3rem 3rem 3rem!important;
	border-radius: 0.3rem;
	box-shadow: box_shadow_card;
	margin-top: 1em;
	
	.profile-photo-col, .profile-edit-col {
		display: flex !important;
		justify-content: center;
		align-items: start;
		.profile-img {
			border-radius: 50%;
		}
	}

	.profile-text-col {
		margin-left: 1.5em;

		@media only screen and (max-width: 767px) {
			text-align: center;
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
			margin-top: 1em;
		}

		.display-badges {
			margin-top: 1.6em;

			.label {
				border-radius: 48px;
				background: #E5007A;
				color: #fff;
				font-size: 14px;
				font-weight: 500;
			}
		}
	}

	.profile-divider {
		margin-top: 3.5em;
	}

	.about-div {
		margin-top: 1.4em;

		h2 {
			font-weight: 500;
			font-size: 22px;
		}

		p {
			font-weight: 400;
			font-size: 16px;
			line-height: 24px;
			color: #7D7D7D !important;
		}
	}
`;
