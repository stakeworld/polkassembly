// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import PreImagesTable from 'src/components/PreImagesTable';

const PreImages = () => {
	return (
		<>
			<h1 className='dashboard-heading'>Preimages</h1>

			<div className="mt-8 mx-1">
				<PreImagesTable />
			</div>
		</>
	);
};

export default PreImages;