// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

const CountBadgePill = ({ className, label, count } :  {className?:string, label?:string, count?: string}) => <div className={`${className} flex items-center gap-x-2`}>
	{label && label}
	{count != null && count != undefined && <span className='bg-gray-200 rounded-full px-2 py-0.5 text-xs font-medium'>{count}</span>}
</div>;

export default CountBadgePill;