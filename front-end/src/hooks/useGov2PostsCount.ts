// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import { subsquidApiHeaders } from 'src/global/apiHeaders';
import { trackInfo } from 'src/global/post_trackInfo';

type Response = {
	[key: keyof typeof trackInfo]: string;
}

const initResponse:Response = {};
const countFetches: any[] = [];

for (const trackName of Object.keys(trackInfo)) {
	initResponse[trackName] = '';
	// TODO: Change to v2
	countFetches.push(
		fetch('https://squid.subsquid.io/harvester/v/v3/graphql',
			{ body: JSON.stringify({
				query: `query MyQuery {
					proposalsConnection(
						where: {type_eq: ReferendumV2, trackNumber_eq: ${trackInfo[trackName].trackId}}
						orderBy: id_ASC
					) {
						totalCount
					}
				}`
			}),
			headers: subsquidApiHeaders,
			method: 'POST'
			})
	);
}

const useGov2PostsCount = () => {
	const [response, setResponse] = useState(initResponse);

	useEffect(() => {
		Promise.all(countFetches).then(async (responseArr) => {
			const responseLocal: Response = Object.assign({}, initResponse);
			const initResponseKeys = Object.keys(trackInfo);

			for (const [index, res] of responseArr.entries()) {
				const response = await res.clone().json();
				responseLocal[initResponseKeys[index]] = response.data.proposalsConnection.totalCount;
			}

			setResponse(responseLocal);
		});
	}, []);

	return response;
};

export default useGov2PostsCount;