// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { subsquidApiHeaders } from 'src/global/apiHeaders';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import Loader from 'src/ui-components/Loader';
import VoteProgress from 'src/ui-components/VoteProgress';
import formatBnBalance from 'src/util/formatBnBalance';

interface Props {
	className?: string;
	referendumId: number;
}

const FellowshipReferendumVotingStatus = ({ className, referendumId }: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [referendumInfo, setReferendumInfo] = useState<any>();
	const [error, setError] = useState<Error | null>(null);

	const fetchVotesData = useCallback(() => {
		setLoading(true);
		fetch('https://squid.subsquid.io/kusama-polkassembly/v/v1/graphql',
			{ body: JSON.stringify({
				query: `query MyQuery {
					proposals(where: {type_eq: FellowshipReferendum, index_eq: ${referendumId}}) {
						id
						tally {
							ayes
							bareAyes
							nays
							support
						}
					}
				}`
			}),
			headers: subsquidApiHeaders,
			method: 'POST'
			})
			.then(async (res) => {
				const response = await res.json();
				setReferendumInfo(response?.data?.proposals?.[0]?.tally);
			}).catch((err) => {
				setError(err);
				console.log('Error in fetching voters :', err);
			}).finally(() => {
				setLoading(false);
			});
	}, [referendumId]);

	useEffect(() => {
		fetchVotesData();
	}, [fetchVotesData]);

	return (
		<GovSidebarCard className={className}>
			{loading && <Loader />}

			{error && <div className='text-center text-red'>{error.message}</div>}

			<h6 className='dashboard-heading mb-6'>Voting Status</h6>

			{referendumInfo && <div className="flex justify-between">
				<VoteProgress
					ayesNum={Number(referendumInfo?.ayes)}
					naysNum={Number(referendumInfo?.nays)}
					isFellowshipReferendum={true}
				/>

				<div className='flex-1 flex flex-col justify-between ml-4 md:ml-12 py-9'>
					<div className='mb-auto flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium'>Ayes</div>
						<div className='text-navBlue'>{referendumInfo?.ayes}</div>
					</div>

					<div className='flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Bare Ayes</div>
						<div className='text-navBlue'>{referendumInfo?.bareAyes}</div>
					</div>

					<div className='mb-auto flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nays</div>
						<div className='text-navBlue'>{referendumInfo?.nays}</div>
					</div>
				</div>

			</div>}
		</GovSidebarCard>
	);
};

export default React.memo(FellowshipReferendumVotingStatus);