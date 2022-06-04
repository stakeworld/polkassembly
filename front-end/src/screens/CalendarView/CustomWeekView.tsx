// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Navigate } from 'react-big-calendar';
// @ts-ignore
import * as TimeGrid from 'react-big-calendar/lib/TimeGrid';

interface CustomViewProps {
	date: any
	localizer: any
	max: any
	min: any
	scrollToTime: any
}

function CustomWeekView({
	date,
	localizer,
	max = localizer.endOf(new Date(), 'day'),
	min = localizer.startOf(new Date(), 'day'),
	scrollToTime = localizer.startOf(new Date(), 'day'),
	...props
}: CustomViewProps): JSX.Element {
	const currRange = useMemo(
		() => CustomWeekView.range(date, { localizer }),
		[date, localizer]
	);

	return (
		<TimeGrid
			date={date}
			eventOffset={15}
			localizer={localizer}
			max={max}
			min={min}
			range={currRange}
			scrollToTime={scrollToTime}
			{...props}
		/>
	);
}

CustomWeekView.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	localizer: PropTypes.object,
	max: PropTypes.instanceOf(Date),
	min: PropTypes.instanceOf(Date),
	scrollToTime: PropTypes.instanceOf(Date)
};

CustomWeekView.range = (date: any, { localizer }: any) => {
	const start = date;
	const end = localizer.add(start, 2, 'day');

	let current = start;
	const range = [];

	while (localizer.lte(current, end, 'day')) {
		range.push(current);
		current = localizer.add(current, 1, 'day');
	}

	return range;
};

CustomWeekView.navigate = (date: any, action: any, { localizer }: any) => {
	switch (action) {
	case Navigate.PREVIOUS:
		return localizer.add(date, -3, 'day');

	case Navigate.NEXT:
		return localizer.add(date, 3, 'day');

	default:
		return date;
	}
};

CustomWeekView.title = (date: any, { localizer }: any) => {
	const [start, ...rest] = CustomWeekView.range(date, { localizer });
	return localizer.format({ end: rest.pop(), start }, 'dayRangeHeaderFormat');
};

export default CustomWeekView;