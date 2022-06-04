// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { HeaderProps } from 'react-big-calendar';

function CustomWeekHeader({
	date,
	localizer,
	label
}: HeaderProps): JSX.Element {
	return (
		<div className='week-header-text'>
			<div className='day-of-week'>{localizer.format(date, 'ddd')}</div>
			<div className='day-num'>{localizer.format(date, 'D')}</div>
		</div>
	);
}

export function TimeGutterHeader(): JSX.Element {
	return <span className='time-gutter-header-text'>UTC</span>;
}

export default CustomWeekHeader;