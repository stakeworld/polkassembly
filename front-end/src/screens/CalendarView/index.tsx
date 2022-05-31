// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Grid, Popup } from 'semantic-ui-react';
import { useGetCalenderEventsQuery } from 'src/generated/graphql';
import getNetwork from 'src/util/getNetwork';

import CustomToolbar from './CustomToolbar';

interface Props {
  className?: string
	small?: boolean
	emitCalendarEvents?: React.Dispatch<React.SetStateAction<any[]>> | undefined
}

const localizer = momentLocalizer(moment);

const NETWORK = getNetwork();

const CalendarView = ({ className, small = false, emitCalendarEvents = undefined }: Props) => {

	const { data, refetch } = useGetCalenderEventsQuery({ variables: {
		network: NETWORK
	} });

	const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() =>  {
		const eventsArr:any[] = [];
		data?.calender_events.forEach(eventObj => {
			eventsArr.push({
				end_time: moment(eventObj.end_time).toDate(),
				id: eventObj.id,
				start_time: moment(eventObj.start_time).toDate(),
				title: eventObj.title
			});
		});
		setCalendarEvents(eventsArr);

		if(emitCalendarEvents) {
			emitCalendarEvents(eventsArr);
		}
	}, [data, emitCalendarEvents]);

	function Event({ event } : {event: any}) {
		return (
			<Popup size='huge' basic content={event.title} on='click' hideOnScroll trigger={<span>{event.title}</span>} />
		);
	}

	return (
		<div className={className}>
			{ !small && <h1>Calendar</h1>}
			<Grid stackable>
				{data && data.calender_events ?
					<Grid.Row>
						<Calendar
							className='events-calendar'
							localizer={localizer}
							events={calendarEvents}
							startAccessor='start_time'
							endAccessor='end_time'
							popup={true}
							components={{
								event: Event,
								toolbar: props => <CustomToolbar {...props} small={small} />
							}}
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

	.custom-calendar-toolbar {
		margin: 0 0 1.5em 1em;

		@media only screen and (max-width: 576px) {
			margin: 0 0 1.5em 0.1em;
		}

		.action-div {
			margin-top: 0.5em;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.button {
				background: none;
    		padding: 8px;

				&:hover {
					background: #eee;
				}
			}

			span {
				word-wrap: none;
				white-space: nowrap;
			}

			.month-select-small, .view-select-small {
				padding-left: 5px !important;
	
				.icon {
					padding-right: 5px !important;
				}
			}

			.month-select-small {
				width: 52px !important;
				min-width: 52px !important;
			}
			
			.view-select-small {
				width: 72px !important;
				min-width: 72px !important;
			}

			.actions-right {
				display: flex;
				align-items: center;
				.today-btn-img {
					cursor: pointer;
					margin-right: 8px;
					@media only screen and (max-width: 576px) {
						margin-right: 8px;
					}
				}
			}

		}
	}

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
