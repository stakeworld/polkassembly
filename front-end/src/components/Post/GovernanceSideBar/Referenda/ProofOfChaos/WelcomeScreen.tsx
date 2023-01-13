// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import React from 'react';
import nftImage from 'src/assets/baby-robot-nft.webp';
import backgroundPOC from 'src/assets/background-POC.png';
import styled from 'styled-components';

const WelcomeScreen = ({ className, setQuizLevel }: {className?: string, setQuizLevel: (level: Number) => void}) => {
	return (
		<div className={className}>
			<div className='flex justify-center relative mb-3'>
				<img className='h-[200px] w-[180px] md:h-[250px]  md:w-[220px] z-10 lg:h-[330px]  lg:w-[282px] rounded-md relative nft-image' src={nftImage} alt='nft' />
				<img src={backgroundPOC} className='absolute z-8 h-full w-full' alt='celebrate' />
			</div>
			<div className='flex flex-col items-center'>
				<div className='text-sidebarBlue mb-1 font-medium text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]'>Woot!</div>
				<div className='text-sidebarBlue mb-5 font-medium text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]'>Pass the quiz successfully to win rare NFTs</div>
				<Button onClick={() => setQuizLevel(1)} className='bg-pink_primary hover:bg-pink_secondary text-white border-pink_primary hover:border-pink_primary rounded-md'>Next</Button>
			</div>
		</div>
	);
};

export default styled(WelcomeScreen)`

`;