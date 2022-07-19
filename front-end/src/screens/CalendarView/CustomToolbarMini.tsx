// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';

function CustomToolbarMini(props: any) {
	function addMonths(date:any, months: any) {
		const d = date.getDate();
		date.setMonth(date.getMonth() + months);
		if (date.getDate() != d) {
			date.setDate(0);
		}

		// setSelectedMonth(date.getMonth());
		return date;
	}

	const goToBack = () => {
		props.onNavigate('prev', addMonths(props.date, -1));
	};

	const goToNext = () => {
		props.onNavigate('next', addMonths(props.date, +1));
	};

	useEffect(() => {
		// setSelectedMonth(props.date.getMonth());
		const now = new Date();
		props.date.setMonth(props.date.getMonth());
		props.date.setYear(now.getFullYear());
		props.onNavigate('current');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		props.date && <div className='custom-calendar-toolbar-mini'>
			<Button onClick={goToBack} icon='chevron left' />
			<span className='date-text'>{moment(props.date).format('MMMM YYYY')}</span>
			<Button onClick={goToNext} icon='chevron right' />
		</div>
	);
}

export default CustomToolbarMini;