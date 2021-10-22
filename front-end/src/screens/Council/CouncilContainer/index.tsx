// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';

import CouncilListing from '../../../components/Listings/CouncilListing';
import FilteredError from '../../../ui-components/FilteredError';
import Loader from '../../../ui-components/Loader';

const MotionsContainer = () => {
	const { api, apiReady } = useContext(ApiContext);
	const [error, setErr] = useState<Error | null>(null);
	const [members, setMembers] = useState<string[]>([]);
	const [runnersUp, setRunnersup] = useState<string[]>([]);
	const [prime, setPrime] = useState<string>('');

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.query.council.prime().then(primeId => {
			setPrime(primeId.unwrapOr('').toString());
		}).catch(error => setErr(error));

		api.query.council.members().then((members) => {
			setMembers(members.map(member => member.toString()));
		}).catch(error => setErr(error));

		api.derive.elections.info().then((electionInfo) => {
			setRunnersup(electionInfo.runnersUp.map(runner => runner.toString().split(',')[0]));
		}).catch(error => setErr(error));

	}, [api, apiReady]);

	if (error) return <FilteredError text={error.message}/>;

	if (members.length || runnersUp.length) {
		return <CouncilListing members={members} prime={prime} runnersUp={runnersUp} />;
	}

	return <Loader/>;
};

export default MotionsContainer;
