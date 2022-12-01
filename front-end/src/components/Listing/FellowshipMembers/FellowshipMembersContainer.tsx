// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable no-tabs */
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { useGetLatestMotionsCountLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

import FellowshipMembersListing from './FellowshipMembersListing';

export type FellowshipMember = {accountId:string, rank: number};

const FellowshipMembersContainer = ({ className } : { className?:string }) => {
	const { api, apiReady } = useContext(ApiContext);
	const [error, setError] = useState<any>();
	const [members, setMembers] = useState<FellowshipMember[]>([]);

	const getFellowshipMembers = async () => {
		if (!api || !apiReady) {
			return;
		}

		// using any because it returns some Codec types
		api.query.fellowshipCollective.members.entries().then((entries: any) => {
			let members: FellowshipMember[] = [];

			for (let i = 0; i < entries.length; i++) {
				// key split into args part to extract
				const [{ args: [accountId] }, optInfo] = entries[i];
				if (optInfo.isSome) {
					members.push({
						accountId: accountId.toString(),
						rank: Number(optInfo.unwrap().rank.toString())
					});
				}
			}

			members = _.orderBy(members, ['rank'], ['asc']);

			setMembers(members);
		}).catch(err => {
			setError(err);
		});

	};

	useEffect(() => {
		if (!api || !apiReady) {
			return;
		}

		getFellowshipMembers();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady]);

	const [refetch] = useGetLatestMotionsCountLazyQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });
	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error) {
		return <ErrorState errorMessage={error.message || 'Error in fetching Fellowship members.'} />;
	}

	if(members.length){

		return (
			<>
				<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
					<div className='flex items-center justify-between'>
						<h1 className='dashboard-heading'>{members.length} Members</h1>
					</div>

					<FellowshipMembersListing className='mt-6' data={members} />
				</div>
			</>
		);
	}

	return (
		<div className={className}><LoadingState /></div>
	);

};

export default FellowshipMembersContainer;