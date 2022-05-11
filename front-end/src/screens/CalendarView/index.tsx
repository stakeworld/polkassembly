// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react-big-calendar/lib/css/react-big-calendar.css';

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Button, Grid, Popup } from 'semantic-ui-react';
import { useGetCalenderEventsQuery } from 'src/generated/graphql';

import CustomToolbar from './CustomToolbar';

interface Props {
  className?: string
}

const localizer = momentLocalizer(moment);

const CalendarView = ({ className }: Props) => {

	const { data, refetch } = useGetCalenderEventsQuery({ variables: {
		network: 'polkadot'
	} });

	// TODO: ENABLE
	// useEffect(() => {
	// refetch();
	// }, [refetch]);

	function Event({ event } : {event: any}) {
		return (
			<Popup size='huge' basic content={event.title} on='click' hideOnScroll trigger={<span>{event.title}</span>} />
		);
	}

	return (
		<div className={className}>
			<h1>Calendar</h1>
			<Grid stackable>
				{data && data.calender_events && data.calender_events.length > 0 ?
					<Grid.Row>
						<Calendar
							className='events-calendar'
							localizer={localizer}
							events={data.calender_events}
							startAccessor='start_time'
							endAccessor='end_time'
							popup={true}
							components={{
								event: Event
								// toolbar: CustomToolbar
							}}
							// onSelectEvent={}
						/>
					</Grid.Row>
					:
					null
				}
			</Grid>
		</div>
	);
};

export default styled(CalendarView)`

.coming-soon-text {
	font-size: 3em;
	text-align: center;
}

h1 {
	@media only screen and (max-width: 576px) {
		margin: 3rem 1rem 1rem 1rem;
	}

	@media only screen and (max-width: 768px) and (min-width: 576px) {
		margin-left: 1rem;
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		margin-left: 1rem;
	}
}

.events-calendar {
	background: #fff;
	padding: 1em;
	border-radius: 5px;
	height: 600px;
	width: 100%;
	max-width: 1024px;
	
	@media only screen and (max-width: 768px) {
		width: 100%;
		max-width: 100%;
		padding: 1em 0 1em 0;
	}

	.rbc-toolbar {
		@media only screen and (max-width: 576px) {
			flex-direction: column;

			span {
				margin-bottom: 1em;
			}
		}
	}

	/* .custom-calendar-toolbar {
		margin: 0 0 1.5em 1em;

		.action-div {
			margin-top: 0.5em;
		}
	} */

	.rbc-day-bg.rbc-today {
		background-color: rgba(230, 0, 123, 0.04);
	}

	.rbc-event {
		background-color: #E6007A;
		border-radius: 3px;

		&:focus {
			outline: none;
		}
	}
}

`;
