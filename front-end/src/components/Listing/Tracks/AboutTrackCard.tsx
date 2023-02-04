// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { LoadingOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useGetTrackInfoLazyQuery } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import { trackInfo } from 'src/global/post_trackInfo';
import { useBlockTime } from 'src/hooks';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import Loader from 'src/ui-components/Loader';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

import DelegateModal from './DelegateModal';

interface Props {
	className?: string;
	trackName: string;
	isMemberReferenda?: boolean
}

const currentNetwork = getNetwork();

const AboutTrackCard = ({ className, trackName, isMemberReferenda } : Props) => {
	const trackMetaData = trackInfo[trackName];

	const { blocktime } = useBlockTime();

	const blockTimeSeconds:number = blocktime / 1000;

	const [getData, { called, data, error, loading, refetch }] = useGetTrackInfoLazyQuery({ variables: {
		track: trackMetaData.trackId
	} });
	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);
	const secondsToRelevantTime = (seconds:number): string => {
		let divisor:number = 1;
		let text:string = 'sec';

		const blockSeconds = seconds*blockTimeSeconds;

		if(blockSeconds >= 60 && blockSeconds < 3600) {
			divisor = 60;
			text = 'min';
		} else if (blockSeconds >= 3600 && blockSeconds < 86400) {
			divisor = 3600;
			text = 'hrs';
		} else if (blockSeconds >= 86400) {
			divisor = 86400;
			text = 'days';
		}

		return `${blockSeconds/divisor} ${text}`;
	};
	return (
		<div className={`${className} bg-white drop-shadow-md rounded-md p-4 md:p-8 text-sidebarBlue`}>
			<div className="flex justify-between capitalize font-medium">
				{isMemberReferenda?
					<h2 className="text-lg capitalize">
						About {trackName.split(/(?=[A-Z])/).join(' ')}
					</h2>:
					<h2 className="text-lg capitalize">
				Fellowship Initiates ( {trackName.split(/(?=[A-Z])/).join(' ')} )
					</h2>}

				<h2 className="text-sm text-pink_primary">{ isMemberReferenda? 'Member Referenda' : trackMetaData.group }</h2>
			</div>

			<p className="mt-5 text-sm font-normal">{isMemberReferenda? 'Aggregation of data across all membership referenda' :  trackMetaData.description}</p>

			{error && <ErrorAlert className="mt-8" errorMsg={error.message} />}

			{!data && <Loader />}

			{data && data.track_info && data.track_info.length && !error ? <div className="mt-8 text-xs w-full max-w-[1000px]">
				<Spin spinning={!data || loading} indicator={<LoadingOutlined />}>
					<Row gutter={[{ xs: 4, sm: 4, md: 16, lg: 32, xl: 32, xxl: 32 }, 16]}>
						<Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].max_deciding && <Row>
								<Col span={15} className='font-bold'>Max Deciding:</Col>
								<Col span={9}>{data?.track_info[0].max_deciding}</Col>
							</Row>
							}

							{data?.track_info[0].decision_period && <Row className='mt-3'>
								<Col span={15} className='font-bold'>Decision Period:</Col>
								<Col span={9}>
									{secondsToRelevantTime(data?.track_info[0].decision_period)}
								</Col>
							</Row>
							}
						</Col>

						<Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].prepare_period && <Row>
								<Col span={15} className='font-bold'>Prepare Period:</Col>
								<Col span={9} className='whitespace-pre'>{secondsToRelevantTime(data?.track_info[0].prepare_period)}</Col>
							</Row>}

							{data?.track_info[0].confirm_period && <Row className='mt-3'>
								<Col span={15} className='font-bold'>Confirm Period:</Col>
								<Col span={9} className='whitespace-pre'>{secondsToRelevantTime(data?.track_info[0].confirm_period)}</Col>
							</Row>}
						</Col>

						{!isMemberReferenda && <Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].min_enactment_period &&<Row>
								<Col xs={15} xl={19} className='font-bold'>Min Enactment Period:</Col>
								<Col xs={9} xl={5} className='whitespace-pre'>{secondsToRelevantTime(data?.track_info[0].min_enactment_period)}</Col>
							</Row>}

							{data?.track_info[0].decision_deposit && <Row className='mt-3'>
								<Col xs={15} xl={19} className='font-bold'>Decision Deopsit:</Col>
								<Col xs={9} xl={5} className='whitespace-pre'>
									{data?.track_info[0].decision_deposit && formatBnBalance(data?.track_info[0].decision_deposit, { numberAfterComma: 2, withUnit: false })}({chainProperties[currentNetwork].tokenSymbol})
								</Col>
							</Row>}
						</Col>}

						{/* <Col xs={24} sm={24} md={12} lg={12} xl={6}>
							<Row>
								<Col span={15} className='font-bold'>Minimum Approval:</Col>
								<Col span={9}>VALUE_HERE</Col>
							</Row>

							<Row className='mt-2'>
								<Col span={15} className='font-bold'>Minimum Support:</Col>
								<Col span={9}>VALUE_HERE</Col>
							</Row>
						</Col> */}
					</Row>
				</Spin>
			</div>
				:
				<></>
			}

			<Divider />

			<div className="flex justify-end">
				<DelegateModal trackNum={trackMetaData.trackId} />
			</div>

		</div>
	);
};

export default AboutTrackCard;