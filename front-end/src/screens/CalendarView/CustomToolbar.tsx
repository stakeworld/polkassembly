// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Implement
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { useEffect, useState } from 'react';
import { DropdownProps, Select } from 'semantic-ui-react';

function CustomToolbar(props: any) {
	const months = [
		{ key: '0', text: 'January', value: 0 },
		{ key: '1', text: 'February', value: 1 },
		{ key: '2', text: 'March', value: 2 },
		{ key: '3', text: 'April', value: 3 },
		{ key: '4', text: 'May', value: 4 },
		{ key: '5', text: 'June', value: 5 },
		{ key: '6', text: 'July', value: 6 },
		{ key: '7', text: 'August', value: 7 },
		{ key: '8', text: 'September', value: 8 },
		{ key: '9', text: 'October', value: 9 },
		{ key: '10', text: 'November', value: 10 },
		{ key: '11', text: 'December', value: 11 }
	];

	const [viewState, setViewState] = useState('month');
	const [selectedMonth, setSelectedMonth] = useState<number>(props.date.getMonth());

	function addMonths(date:any, months: any) {
		const d = date.getDate();
		date.setMonth(date.getMonth() + months);
		if (date.getDate() != d) {
			date.setDate(0);
		}
		console.log(date);
		return date;
	}

	function addWeeks(date: any, weeks: any) {
		date.setDate(date.getDate() + 7 * weeks);
		return date;
	}

	function addDays(date: any, days: any) {
		date.setDate(date.getDate() + days);
		console.log(date);
		return date;
	}

	const goToDayView = () => {
		props.onView('day');
		setViewState('day');
	};

	// const goToWeekView = () => {
	// props.onView('week');
	// setViewState('week');
	// };

	const goToMonthView = () => {
		props.onView('month');
		setViewState('month');
	};

	// const goToBack = () => {
	// 	if (viewState === 'month') {
	// 		props.onNavigate('prev', addMonths(props.date, -1));
	// 	} else if (viewState === 'week') {
	// 		props.onNavigate('prev', addWeeks(props.date, -1));
	// 	} else {
	// 		props.onNavigate('prev', addDays(props.date, -1));
	// 	}
	// };

	// const goToNext = () => {
	// 	if (viewState === 'month') {
	// 		props.onNavigate('next', addMonths(props.date, +1));
	// 	} else if (viewState === 'week') {
	// 		props.onNavigate('next', addWeeks(props.date, +1));
	// 	} else {
	// 		props.onNavigate('next', addDays(props.date, +1));
	// 	}
	// };

	const goToToday = () => {
		const now = new Date();
		props.date.setMonth(now.getMonth());
		props.date.setYear(now.getFullYear());
		props.date.setDate(now.getDate());
		props.onNavigate('current');
	};

	const onSelectMonthChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setSelectedMonth(Number(data.value));
		const now = new Date();
		props.date.setMonth(data.value);
		props.date.setYear(now.getFullYear());
		props.date.setDate(now.getDate());
		props.onNavigate('current');
	};

	useEffect(() => {
		setSelectedMonth(props.date.getMonth());
		const now = new Date();
		props.date.setMonth(props.date.getMonth());
		props.date.setYear(now.getFullYear());
		props.onNavigate('current');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='custom-calendar-toolbar'>
			<div className='action-div'>
				<Select compact value={selectedMonth} onChange={onSelectMonthChange} options={months} />
				{/* <button onClick={goToBack}>&#8249;</button> */}
				<button onClick={goToToday}>today</button>
				{/* <button onClick={goToNext}>&#8250;</button> */}
				<button onClick={goToMonthView}>month</button>
				{/* <button onClick={goToWeekView}>week</button> */}
				<button onClick={goToDayView}>day</button>
			</div>
		</div>
	);
}

export default CustomToolbar;