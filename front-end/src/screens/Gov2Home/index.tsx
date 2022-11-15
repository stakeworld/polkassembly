// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FieldTimeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Gov2Home = () => {

	const navigate = useNavigate();

	return (
		<section className="flex flex-col items-center justify-center mt-8 md:mt-20 text-center">
			<FieldTimeOutlined className='text-6xl md:text-9xl text-navBlue' />
			<h1 className='text-4xl md:text-6xl my-8 text-navBlue'>Coming Soon</h1>
			<Button className='mt-4 py-2 px-6 bg-pink_primary text-white border-white hover:bg-pink_secondary rounded-md text-lg h-[50px] w-[215px]' onClick={() => navigate(-1)}>Go back</Button>
		</section>
	);
};

export default Gov2Home;