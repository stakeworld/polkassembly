// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';

function CustomToolbarMini(props: any) {
	const [viewState, setViewState] = useState<string>('month');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedMonth, setSelectedMonth] = useState<number>(props.date.getMonth());

	function addMonths(date:any, months: any) {
		const d = date.getDate();
		date.setMonth(date.getMonth() + months);
		if (date.getDate() != d) {
			date.setDate(0);
		}

		setSelectedMonth(date.getMonth());
		return date;
	}

	function addWeeks(date: any, weeks: any) {
		date.setDate(date.getDate() + 7 * weeks);
		setSelectedMonth(date.getMonth());
		return date;
	}

	function addDays(date: any, days: any) {
		date.setDate(date.getDate() + days);
		setSelectedMonth(date.getMonth());
		return date;
	}

	const goToBack = () => {
		if (viewState === 'month' || viewState === 'agenda') {
			props.onNavigate('prev', addMonths(props.date, -1));
		} else if (viewState === 'week') {
			props.onNavigate('prev', addWeeks(props.date, -1));
		} else {
			props.onNavigate('prev', addDays(props.date, -1));
		}
	};

	const goToNext = () => {
		if (viewState === 'month' || viewState === 'agenda') {
			props.onNavigate('next', addMonths(props.date, +1));
		} else if (viewState === 'week') {
			props.onNavigate('next', addWeeks(props.date, +1));
		} else {
			props.onNavigate('next', addDays(props.date, +1));
		}
	};

	useEffect(() => {
		setSelectedMonth(props.date.getMonth());
		const now = new Date();
		props.date.setMonth(props.date.getMonth());
		props.date.setYear(now.getFullYear());
		props.onNavigate('current');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setViewState(`${props.view}`);
	},[props.view]);

	return (
		props.date && <div className='custom-calendar-toolbar-mini'>
			<Button onClick={goToBack} icon='chevron left' />
			<span className='date-text'>{moment(props.date).format('MMMM YYYY')}</span>
			<Button onClick={goToNext} icon='chevron right' />
		</div>
	);
}

export default CustomToolbarMini;