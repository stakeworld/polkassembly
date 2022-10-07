// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { Image } from 'semantic-ui-react';
import { Profile, useGetUserDetailsQuery } from 'src/generated/graphql';

interface Props {
	className?: string
	username: string | null
	size?: 'sm' | 'md' | 'lg'
	id: number | null
}

const Avatar = ({ className, id, username, size }: Props) => {
	const [userProfileData, setUserProfileData] = useState<Profile | null>(null);

	const { data, refetch } = useGetUserDetailsQuery({
		variables: {
			user_id: Number(id)
		}
	});

	useEffect(() => {
		if(!data?.userDetails) return;
		setUserProfileData(data?.userDetails);
	}, [data]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={size? `${className} ${size}` : className}>
			{userProfileData?.image? <Image src={userProfileData?.image} avatar /> :  username?.substring(0, 1)}
		</div>
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

	&.avatar:has(img) {
		display: flex !important;
		align-items: center !important;
		background-color: transparent;
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
