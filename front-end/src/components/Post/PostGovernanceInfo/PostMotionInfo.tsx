// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import styled from '@xstyled/styled-components';
import * as React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { Button, Grid } from 'semantic-ui-react';
import ArgumentsTable from 'src/components/ArgumentsTable';

import { OnchainLinkMotionFragment, OnchainLinkMotionPreimageFragment, OnchainLinkMotionTreasuryFragment } from '../../../generated/graphql';
import { chainProperties } from '../../../global/networkConstants';
import AddressComponent from '../../../ui-components/Address';
import OnchainInfoWrapper from '../../../ui-components/OnchainInfoWrapper';
import getNetwork from '../../../util/getNetwork';
import ExternalLinks from '../../ExternalLinks';

interface Props {
	className?: string;
	onchainLink: OnchainLinkMotionFragment
}

const PostMotionInfo = ({ className, onchainLink }: Props) => {
	const [dataViewMode, setDataViewMode] = useState<'table' | 'json'>('table');

	if (!onchainLink) return null;

	const {
		onchain_motion: onchainMotion,
		proposer_address: proposerAddress
	} = onchainLink;

	if (! onchainMotion?.[0]) {
		return null;
	}

	const { memberCount, method, motionProposalArguments, motionProposalHash, preimage, treasurySpendProposal } = onchainMotion[0];

	const argumentsJSON: any[] = [];
	motionProposalArguments?.forEach(obj => {
		const objCopy = obj;
		delete objCopy.__typename;
		argumentsJSON.push(objCopy);
	});

	return (
		<OnchainInfoWrapper className={className}>
			<h4>On-chain info</h4>
			<Grid>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Proposer</h6>
					<AddressComponent address={proposerAddress}/>
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Member count</h6>
					{memberCount}
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Motion hash</h6>
					{motionProposalHash}
				</Grid.Column>
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Motion&apos;s method</h6>
					<span className={method === 'rejectProposal' ? 'bold-red-text' : ''}>{method}</span>
				</Grid.Column>
				<Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={16}>
						{motionProposalArguments && motionProposalArguments.length
							? <>
								<h6 className='arguments-heading'> Arguments :
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
													<ArgumentsTable argumentsJSON={motionProposalArguments} />
												</tbody>
											</table>
										</div>
										:
										<div className="json-view">
											<ReactJson
												src={argumentsJSON}
												iconStyle='circle'
												enableClipboard={false}
												displayDataTypes={false}
											/>
										</div>
								}

								{/* {motionProposalArguments.map((element, index) => {
									return <div className={'methodArguments'} key={index}>
										<span key={index}>{element.name}: {element.value}</span>
									</div>;
								})} */}
							</>
							: null}
					</Grid.Column>
				</Grid.Row>
				<ProposalInfo preimage={preimage}/>
				<TreasuryInfo treasurySpendProposal={treasurySpendProposal}/>
				<Grid.Column mobile={16} tablet={16} computer={16}>
					<ExternalLinks isMotion={true} onchainId={onchainLink.onchain_motion_id} />
				</Grid.Column>
			</Grid>
		</OnchainInfoWrapper>
	);
};

const ProposalInfo = ({ preimage } : {preimage?: OnchainLinkMotionPreimageFragment | null}) => {

	if (!preimage) {
		return null;
	}

	const { metaDescription, method: preimageMethod, preimageArguments } = preimage;

	return (
		<Grid.Row className='motion-sub-info'>
			{preimageMethod &&
				<>
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Method</h6>
						{preimageMethod}
					</Grid.Column>
					<Grid.Column mobile={16} tablet={8} computer={8}>
						{preimageArguments && preimageArguments.length
							? <>
								<h6>Arguments</h6>
								{preimageArguments.map((element, index) => {
									const isAccountArgument = element.name === 'account';
									return <div className={isAccountArgument ? '' : 'methodArguments'} key={index}>
										{isAccountArgument
											? <AddressComponent address={element.value} key={index}/>
											: <span key={index}>{element.name}: {element.value}</span>
										}
									</div>;
								})}
							</>
							: null}
					</Grid.Column>
				</>
			}
			<Grid.Column mobile={16} tablet={16} computer={16}>
				{ metaDescription &&
					<>
						<h6>Description</h6>
						{metaDescription}
					</>
				}
			</Grid.Column>
		</Grid.Row>
	);
};

const TreasuryInfo = ({ treasurySpendProposal }: {treasurySpendProposal?: OnchainLinkMotionTreasuryFragment | null}) => {

	if (!treasurySpendProposal){
		return null;
	}

	const currentNetwork = getNetwork();
	const { beneficiary, bond, value } = treasurySpendProposal;

	return (
		<Grid.Row className='motion-sub-info'>
			{beneficiary &&
				<Grid.Column mobile={16} tablet={8} computer={8}>
					<h6>Beneficiary</h6>
					<AddressComponent address={beneficiary} />
				</Grid.Column>}
			{value && currentNetwork &&
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Value</h6>
						{parseInt(value) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Grid.Column>}
			{bond && currentNetwork &&
				<>
					<Grid.Column mobile={16} tablet={8} computer={8}/>
					<Grid.Column mobile={16} tablet={8} computer={8}>
						<h6>Bond</h6>
						{parseInt(bond) / Math.pow(10, chainProperties[currentNetwork].tokenDecimals) + ' ' + chainProperties[currentNetwork].tokenSymbol}
					</Grid.Column>
				</>}
		</Grid.Row>
	);
};

export default styled(PostMotionInfo)`
	.bold-red-text {
		color: red_primary;
		font-weight: bold;
	}
`;
