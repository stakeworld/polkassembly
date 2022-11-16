// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DesktopOutlined, FileTextOutlined, HomeFilled, PlayCircleFilled, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Space } from 'antd';
import React, { useEffect } from 'react';
// import Gov2InfoBG from 'src/assets/gov2-info-bg.png';
import { useNetworkSocialsLazyQuery } from 'src/generated/graphql';
import { CubeIcon, DiscordIcon, GithubIcon, RedditIcon, TelegramIcon } from 'src/ui-components/CustomIcons';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import getNetwork from 'src/util/getNetwork';

const network = getNetwork();

export const socialLinks = (blockchain_socials: any) => {
	if (!blockchain_socials) {
		return null;
	}

	return (
		<Space size={19} className='items-center'>
			{blockchain_socials.homepage &&
					<a href={blockchain_socials.homepage} target='_blank' rel='noreferrer'>
						<HomeFilled className='text-sm md:text-lg md:mr-1 text-sidebarBlue' />
					</a>
			}
			{blockchain_socials.twitter &&
					<a href={blockchain_socials.twitter} target='_blank' rel='noreferrer'>
						<TwitterOutlined className='text-sm md:text-lg md:mr-1 text-sidebarBlue' />
					</a>
			}
			{blockchain_socials.discord &&
					<a href={blockchain_socials.discord} target='_blank' rel='noreferrer'>
						<DiscordIcon className='text-sm md:text-lg md:mr-1' />
					</a>
			}
			{blockchain_socials.github &&
					<a href={blockchain_socials.github} target='_blank' rel='noreferrer'>
						<GithubIcon className='text-sm md:text-lg md:mr-1' />
					</a>
			}
			{blockchain_socials.youtube &&
					<a href={blockchain_socials.youtube} target='_blank' rel='noreferrer'>
						<YoutubeFilled className='text-sm md:text-lg md:mr-1 text-sidebarBlue' />
					</a>
			}
			{blockchain_socials.reddit &&
					<a href={blockchain_socials.reddit} target='_blank' rel='noreferrer'>
						<RedditIcon className='text-sm md:text-lg md:mr-1' />
					</a>
			}
			{blockchain_socials.telegram &&
					<a href={blockchain_socials.telegram} target='_blank' rel='noreferrer'>
						<TelegramIcon className='text-sm md:text-lg md:mr-1' />
					</a>
			}
			{blockchain_socials.block_explorer &&
					<a href={blockchain_socials.block_explorer} target='_blank' rel='noreferrer'>
						<CubeIcon className='text-white text-sm md:text-lg md:mr-1' />
					</a>
			}
		</Space>
	);
};

const gov2Link = ({ className, icon, text, subText } : { className?: string, icon?:any, text:string, subText:string }) =>
	<div className={`${className} flex min-w-[260px]`}>
		<div className="mr-3 flex items-center justify-center min-w-[132px] h-[75px] bg-[url('/src/assets/gov2-info-bg.png')]">
			{icon}
		</div>

		<div className='flex flex-col justify-between my-1'>
			<div className="text-sidebarBlue">{text}</div>
			<div className="text-navBlue">{subText}</div>
		</div>
	</div>;

const AboutNetwork = ({ className, showGov2Links } : { className?: string, showGov2Links?: boolean }) => {
	const [refetch, { data, error }] = useNetworkSocialsLazyQuery({ variables: {
		network
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={`${className} bg-white drop-shadow-md p-5 md:p-6 rounded-md`}>
			<div className="flex items-center justify-between">
				<h2 className='dashboard-heading'>About</h2>
				{error && <ErrorAlert errorMsg={error.message} className='mb-4' />}
				<div className='hidden lg:inline-block'>
					{!error && data && socialLinks(data.blockchain_socials[0])}
				</div>
			</div>

			<p className='mt-5'>Join our Community to discuss, contribute and get regular updates from us!</p>

			<div className='mt-5 lg:hidden flex justify-center'>
				{!error && data && socialLinks(data.blockchain_socials[0])}
			</div>

			{
				showGov2Links &&
				<div className='mt-12 pb-2 flex justify-between xl:w-[90%] overflow-x-auto'>
					{gov2Link({
						className: 'mr-12 lg:mr-9',
						icon: <PlayCircleFilled className='text-white text-xl' />,
						subText: '02:03 mins',
						text: 'Gavin\'s view on Gov2'
					})}

					{gov2Link({
						className: 'mr-12 lg:mr-9',
						icon: <DesktopOutlined className='text-white text-xl' />,
						subText: '02:03 mins',
						text: 'Gavin\'s blog on Medium'
					})}

					{gov2Link({
						className: 'mr-12 lg:mr-0',
						icon: <FileTextOutlined className='text-white text-xl' />,
						subText: '02:03 mins',
						text: 'Notes on Gov. V2 learnings'
					})}
				</div>
			}
		</div>
	);
};

export default styled(AboutNetwork)`
	.anticon:hover {
		outline: pink_primary 2px solid;
		path {
			fill: pink_primary !important;
		}
	}
`;