// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { Profile, useUserWithUsernameQuery } from 'src/generated/graphql';

interface Props {
	className?: string
	username: string | null
	size?: 'sm' | 'md' | 'lg'
}

const Avatar = ({ className, username, size }: Props) => {
	const [userProfileData, setUserProfileData] = useState<Profile | null>(null);

	const { data, refetch } = useUserWithUsernameQuery({
		variables: {
			username: `${username}`
		}
	});

	useEffect(() => {
		if(!data?.userWithUsername) return;
		setUserProfileData(data?.userWithUsername);
	}, [data]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<Link to={`/user/${username}`} className={size? `${className} ${size}` : className}>
			{userProfileData?.image? <Image src={userProfileData?.image} avatar /> :  username?.substring(0, 1)}
		</Link>
	);
};

export default styled(Avatar)`
	border-radius: 50%;
	display: inline-block;
	vertical-align: top;
	overflow: hidden;
	text-transform: uppercase;
	text-align: center;
	background-color: grey_primary;
	color: white;

	&:hover {
		color: white;
	}
	&.avatar:has(img) {
		display: flex !important;
		align-items: center !important;
		background-color: transparent;
	}
	&.avatar.sm > .image {
		width: 2rem;
		height: 2rem;
	}
	&.avatar.md > .image {
		width: 3rem;
		height: 3rem;
	}
	
	&.avatar.lg > .image {
		width: 4rem;
		height: 4rem;
	}

	&.sm {
		width: 2rem;
		height: 2rem;
		font-size: xs;
	}
	&.md {
		width: 3rem;
		height: 3rem;
		font-size: md;
	}
	&.lg {
		width: 4rem;
		height: 4rem;
		font-size: lg;
		line-height: 4rem;
	}
`;
