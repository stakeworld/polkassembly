// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import Loader from 'src/ui-components/Loader';
import VoteProgress from 'src/ui-components/VoteProgress';
import formatBnBalance from 'src/util/formatBnBalance';

interface Props {
	className?: string;
	referendumId: number;
}

const ReferendumV2VotingStatus = ({ className, referendumId }: Props) => {
	const { api, apiReady } = useContext(ApiContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [referendumInfo, setReferendumInfo] = useState<any | null>(null);

	const getReferendaInfo = useCallback(async () => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const referendumInfoOf = await api.query.referenda.referendumInfoFor(referendumId);

		const parsedReferendumInfo: any = referendumInfoOf.toJSON();

		const voteInfo = {
			aye_amount: typeof parsedReferendumInfo.ongoing.tally.ayes === 'string' ? new BN(parsedReferendumInfo.ongoing.tally.ayes.slice(2), 'hex') : new BN(parsedReferendumInfo.ongoing.tally.ayes),
			nay_amount: typeof parsedReferendumInfo.ongoing.tally.nays === 'string' ? new BN(parsedReferendumInfo.ongoing.tally.nays.slice(2), 'hex') : new BN(parsedReferendumInfo.ongoing.tally.nays),
			support_amount: typeof parsedReferendumInfo.ongoing.tally.support === 'string' ? new BN(parsedReferendumInfo.ongoing.tally.support.slice(2), 'hex') : new BN(parsedReferendumInfo.ongoing.tally.support)
		};

		setReferendumInfo(voteInfo);
	}, [api, apiReady, referendumId]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		setLoading(true);

		let unsubscribe: () => void;

		getReferendaInfo();

		setLoading(false);

		return () => unsubscribe && unsubscribe();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[api, apiReady, referendumId]);

	return (
		<GovSidebarCard className={className}>
			{loading && <Loader />}

			<h6 className='dashboard-heading mb-6'>Voting Status</h6>

			{referendumInfo && <div className="flex justify-between">
				<VoteProgress
					ayeVotes={referendumInfo?.aye_amount}
					nayVotes={referendumInfo?.nay_amount}
				/>

				<div className='flex-1 flex flex-col justify-between ml-4 md:ml-12 py-9'>
					<div className='mb-auto flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium'>Ayes</div>
						<div className='text-navBlue'>{formatBnBalance(referendumInfo?.aye_amount, { numberAfterComma: 2, withUnit: true })}</div>
					</div>

					<div className='mb-auto flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nays</div>
						<div className='text-navBlue'>{formatBnBalance(referendumInfo?.nay_amount, { numberAfterComma: 2, withUnit: true })}</div>
					</div>

					<div className='flex items-center'>
						<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Support</div>
						<div className='text-navBlue'>{formatBnBalance(referendumInfo?.support_amount, { numberAfterComma: 2, withUnit: true })}</div>
					</div>
				</div>

			</div>}
		</GovSidebarCard>
	);
};

export default React.memo(ReferendumV2VotingStatus);