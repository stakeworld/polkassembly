// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as moment from 'moment';
import * as React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { Button, Grid } from 'semantic-ui-react';
import ArgumentsTable from 'src/components/ArgumentsTable';
import BlockCountdown from 'src/components/BlockCountdown';
import BlocksToTime from 'src/components/BlocksToTime';

import { OnchainLinkReferendumFragment } from '../../../generated/graphql';
import AddressComponent from '../../../ui-components/Address';
import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';
import ExternalLinks from '../../ExternalLinks';

interface Props{
	onchainLink: OnchainLinkReferendumFragment
}

const PostReferendumInfo = ({ onchainLink }: Props) => {
	const [dataViewMode, setDataViewMode] = useState<'table' | 'json'>('table');

	if (!onchainLink) return null;

	const {
		onchain_referendum: onchainReferendum,
		proposer_address: proposerAddress
	} = onchainLink;

	if ( !onchainReferendum?.[0] ){
		return null;
	}

	const { delay, end, referendumStatus, preimage, voteThreshold } = onchainReferendum?.[0];
	const { metaDescription, method, preimageArguments } = preimage || {};
	const { blockNumber, status } = referendumStatus?.[0] || {};

	const argumentsArr: any[] = [];
	preimageArguments?.forEach(obj => {
		delete obj.__typename;
		const argumentsObj: any = {};
		argumentsObj['id'] = obj.id;
		argumentsObj['name'] = obj.name;
		try {
			argumentsObj['value'] = JSON.parse(obj.value);
		} catch {
			argumentsObj['value'] = obj.value;
		}
		argumentsArr.push(argumentsObj);
	});

	return (
		<OnchainInfoWrapper>
			<h4>On-chain info</h4>
			<Grid>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Proposer</h6>
					<AddressComponent address={proposerAddress}/>
				</Grid.Column>
				{(delay || delay === 0) &&
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Delay</h6>
						<BlocksToTime blocks={delay} />
					</Grid.Column>}
				{end &&
					<Grid.Column mobile={16} tablet={8} computer={8}>
						{status === 'Started'
							?
							<>
								<h6>End</h6>
								<BlockCountdown endBlock={end}/>
							</>
							:
							<>
								<h6>Ended</h6>
								<div>{moment.utc(blockNumber?.startDateTime).format('DD MMM YYYY, HH:mm:ss')}</div>
							</>
						}
					</Grid.Column>}
				{voteThreshold &&
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Vote threshold</h6>
						{voteThreshold}
					</Grid.Column>}
				{method &&
				<Grid.Row>
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Method</h6>
						{method}
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={16}>
						{preimageArguments && preimageArguments.length
							? <>
								<h6 className='arguments-heading mt'> Arguments :
									<Button.Group size='tiny'>
										<Button className={dataViewMode == 'table' ? 'active-btn' : ''} onClick={() => setDataViewMode('table')}>Table</Button>
										<Button className={dataViewMode == 'json' ? 'active-btn' : ''} onClick={() => setDataViewMode('json')}>JSON</Button>
									</Button.Group>
								</h6>

								{
									dataViewMode == 'table' ?
										<div className="table-view">
											<table cellSpacing={0} cellPadding={0}>
												<tbody>
													<ArgumentsTable argumentsJSON={argumentsArr} />
												</tbody>
											</table>
										</div>
										:
										<div className="json-view">
											<ReactJson
												src={argumentsArr}
												iconStyle='circle'
												enableClipboard={false}
												displayDataTypes={false}
											/>
										</div>
								}

								{/* {preimageArguments.map((element, index) => {
									const isAccountArgument = element.name === 'account';
									return <div className={isAccountArgument ? '' : 'methodArguments'} key={index}>
										{isAccountArgument
											? <AddressComponent address={element.value} key={index}/>
											: <span key={index}>{element.name}: {element.value}</span>
										}
									</div>;
								})} */}
							</>
							: null}
					</Grid.Column>
				</Grid.Row>}
				{metaDescription &&
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<h6>Description</h6>
					{metaDescription}
				</Grid.Column>}
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<ExternalLinks isReferendum={true} onchainId={onchainLink.onchain_referendum_id} />
				</Grid.Column>
			</Grid>
		</OnchainInfoWrapper>
	);
};

export default PostReferendumInfo;
