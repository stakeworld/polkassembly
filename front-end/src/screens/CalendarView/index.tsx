// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Divider, Grid, Icon } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetCalenderEventsQuery } from 'src/generated/graphql';
import { approvalStatus } from 'src/global/statuses';
import getNetwork from 'src/util/getNetwork';

import chainLink from '../../assets/chain-link.png';
import CreateEventSidebar from './CreateEventSidebar';
import CustomToolbar from './CustomToolbar';
import CustomWeekHeader, { TimeGutterHeader } from './CustomWeekHeader';
import NetworkSelect from './NetworkSelect';

interface Props {
  className?: string
	small?: boolean
	emitCalendarEvents?: React.Dispatch<React.SetStateAction<any[]>> | undefined
}

const localizer = momentLocalizer(moment);

const NETWORK = getNetwork();

const CalendarView = ({ className, small = false, emitCalendarEvents = undefined }: Props) => {
	// calculate #route-wrapper height with margin for sidebar.
	const routeWrapperEl = document.getElementById('route-wrapper');
	let routeWrapperHeight = routeWrapperEl?.offsetHeight;
	if(routeWrapperEl && routeWrapperHeight) {
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-top'));
		routeWrapperHeight += parseInt(window.getComputedStyle(routeWrapperEl).getPropertyValue('margin-bottom'));
	}

	const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

	const { id } = useContext(UserDetailsContext);

	const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
	const [selectedView, setSelectedView] = useState<string>('month');
	const [selectedNetwork, setSelectedNetwork] = useState<string>(NETWORK);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [sidebarEvent, setSidebarEvent] = useState<any>();
	const [sidebarCreateEvent, setSidebarCreateEvent] = useState<boolean>(false);

	const { data, refetch } = useGetCalenderEventsQuery({ variables: {
		approval_status: approvalStatus.APPROVED,
		network: selectedNetwork
	} });

	// useEffect(() => {
	// refetch();
	// }, [refetch]);

	useEffect(() =>  {
		const eventsArr:any[] = [];
		data?.calender_events.forEach(eventObj => {
			eventsArr.push({
				content: eventObj.content,
				end_time: moment(eventObj.end_time).toDate(),
				id: eventObj.id,
				start_time: moment(eventObj.end_time).toDate(),
				status: eventObj.status,
				title: eventObj.title,
				url: eventObj.url
				// location: eventObj.location
			});
		});

		setCalendarEvents(eventsArr);

		if(emitCalendarEvents) {
			emitCalendarEvents(eventsArr);
		}
	}, [data, emitCalendarEvents]);

	function showEventSidebar(event: any) {
		if(small){
			return;
		}

		setSidebarEvent(event);
	}

	const EventWrapperComponent = ({ event, children }: any) => {
		const newChildren = { ...children };
		const newChildrenProps = { ...newChildren.props };
		const statusClassName = moment(event.end_time).isBefore() ? 'overdue-border' : `${event.status?.toLowerCase()}-border`;
		newChildrenProps.className = `${newChildrenProps.className} ${statusClassName}`;
		newChildren.props = { ...newChildrenProps };
		return <div className='custom-event-wrapper'>{newChildren}</div>;
	};

	function Event({ event } : {event: any}) {
		return (
			<span className='event-container-span' onClick={() => showEventSidebar(event)}>
				{ (!(small || width < 768)) &&  <span className='event-time'> {moment(event.end_time).format('LT').toLowerCase()}</span> }
				{event.title}
			</span>
		);
	}

	return (
		<div className={className}>
			{ !small && <div className='cal-heading-div'>
				<h1> Calendar </h1>
				<div className='mobile-network-select'>
					<NetworkSelect selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} />
				</div>
			</div>
			}

			<Grid stackable>
				{data && data.calender_events ?
					<Grid.Row className='pt-0'>
						<Calendar
							className={`events-calendar ${small || width < 768 ? 'small' : '' }`}
							localizer={localizer}
							events={calendarEvents}
							startAccessor='start_time'
							endAccessor='end_time'
							popup={false}
							components={{
								event: Event,
								eventWrapper: EventWrapperComponent,
								timeGutterHeader: () => <TimeGutterHeader localizer={localizer} date={selectedDate} selectedView={selectedView} />,
								toolbar: props => <CustomToolbar
									{...props}
									small={small}
									width={width}
									selectedNetwork={selectedNetwork}
									setSelectedNetwork={setSelectedNetwork}
									setSidebarCreateEvent={setSidebarCreateEvent}
									isLoggedIn={Boolean(id)}
								/>,
								week: {
									header: props => <CustomWeekHeader {...props} small={small || width < 768} />
								}
							}}
							formats={{
								timeGutterFormat: 'h A'
							}}
							onNavigate={setSelectedDate}
							onView={setSelectedView}
							views={{
								agenda: true,
								day: true,
								month: true,
								week: true
							}}
						/>
					</Grid.Row>
					:
					null
				}
			</Grid>

			{/* Event View Sidebar */}
			{routeWrapperHeight && sidebarEvent && <div className="events-sidebar" style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>
				<div className="event-sidebar-header d-flex">
					<div className='d-flex'>
						<Icon name='circle' className={`status-icon ${moment(sidebarEvent.end_time).isBefore() ? 'overdue-color' : `${sidebarEvent.status?.toLowerCase()}-color`}`} />
						<h1>{sidebarEvent.title}</h1>
					</div>
					<Icon className='close-btn' name='close' onClick={() => setSidebarEvent(false)} />
				</div>

				<div className="sidebar-event-datetime">
					<span>{moment(sidebarEvent.end_time).format('MMMM D')}</span> <span>{moment(sidebarEvent.end_time).format('h:mm a')}</span>
				</div>

				{sidebarEvent.content && <div className="sidebar-event-content">
					{`${sidebarEvent.content.substring(0, 769)} ${sidebarEvent.content.length > 769 ? '...' : ''}`}
					{sidebarEvent.content.length > 769 && <><br/><a href={sidebarEvent.url} target='_blank' rel='noreferrer'>Show More</a></>}
				</div>
				}

				<Divider />

				<div className="sidebar-event-links">
					<h3> <img src={chainLink} /> Relevant Links</h3>
					<div className='links-container'>
						<a href={sidebarEvent.url} target='_blank' rel='noreferrer'>{sidebarEvent.url}</a>
					</div>
				</div>
			</div>}

			{/* Create Event Sidebar */}
			{routeWrapperHeight && sidebarCreateEvent &&
				<CreateEventSidebar
					setSidebarCreateEvent={setSidebarCreateEvent}
					refetch={refetch}
					routeWrapperHeight={routeWrapperHeight}
					selectedNetwork={selectedNetwork}
					className='create-event-sidebar'
					id={id}
				/>
			}
		</div>
	);
};

export default styled(CalendarView)`
.events-sidebar, .create-event-sidebar {
	position: absolute;
	min-width: 250px;
	width: 510px;
	max-width: 35vw;
	right: 0;
	top: 6.5rem;
	background: #fff;
	z-index: 100;
	padding: 40px 24px;
	box-shadow: -5px 0 15px -12px #888;

	@media only screen and (max-width: 768px) {
		max-width: 90vw;
		top: 0;
		padding: 40px 14px;
		padding-top: 70px;
		overflow-y: auto;

		h1 {
			margin-top: 0;
		}

		.sidebar-event-content {
			padding-right: 10px;
		}
	}

	.d-flex {
		display: flex !important;
	}

	.event-sidebar-header {
		justify-content: space-between;

		.status-icon {
			margin-right: 9px;
			font-size: 12px;
			color: #E5007A;

			&.overdue-color {
				color: #FF0000;
			}

			&.completed-color {
				color: #5BC044;
			}

			&.in_progress-color {
				color: #EA8612;
			}
		}

		h1 {
			font-size: 20px !important;
		}

		.close-btn {
			cursor: pointer;
		}
	}

	.sidebar-event-datetime {
		margin-top: 14px;
		margin-left: 25px;

		span {
			&:first-child {
				border-right: 2px #eee solid;
				padding-right: 12px;
				margin-right: 8px;
			}
		}
	}
	
	.sidebar-event-content {
		margin-top: 30px;
		margin-left: 25px;
		padding-right: 25px;
		font-size: 16px;
		line-height: 24px;

		a {
			color: #E5007A;
		}
	}

	.divider {
		margin-top: 35px;
		margin-bottom: 35px;
	}

	.sidebar-event-links {
		img {
			height: 24px;
			width: 24px;
			margin-right: 12px;
		}

		h3 {
			font-size: 20px;
			display: flex;
			align-items: center;
		}

		.links-container {
			padding-left: 37px;
			a {
				margin-top: 25px;
				color: #848484;
				word-break: break-all;
			}
		}

	}

}

.create-event-sidebar {
	overflow-y: auto;
	min-width: 350px !important;
	width: 610px !important;
	max-width: 60vw !important;

	@media only screen and (max-width: 768px) {
		min-width: 250px !important;
		max-width: 90vw !important;
	}

	.create-event-sidebar-header {
		justify-content: space-between !important;

		h1 {
			font-weight: 500;
			font-size: 32px !important;
		}

		@media only screen and (max-width: 768px) {
			h1 {
				font-weight: 500;
				font-size: 32px !important;
				margin-left: 0;
			}
		}
	}

	.create-event-form {
		margin-top: 48px;

		@media only screen and (max-width: 768px) {
			margin-top: 18px;
		}

		.input.error {
			border: 1px solid #FF0000;
		}

		.input-label {
			font-weight: 500;
			font-size: 16px;
			color: #7D7D7D;
			margin-bottom: 12px;

			@media only screen and (max-width: 768px) {
				font-size: 14px;
			}
		}
		
		.text-input {
			height: 35px;
			border-radius: 5px;
			margin-bottom: 18px;
			font-size: 16px;

			@media only screen and (max-width: 768px) {
				font-size: 14px;
				height: 38px;
				margin-bottom: 12px;
			}
		}

		.radio-input-group {
			margin-top: 12px;
			
			.checkbox{
				margin-right: 20px !important;

				&.checked {
					label {
						color: #E5007A;

						&::after {
							background-color: #E5007A !important;
						}
					}
				}

				label {
					font-size: 16px !important;
					padding-left: 20px !important;

					@media only screen and (max-width: 768px) {
						font-size: 14px;
					}
				}

			}
		}

		.date-input-row {
			margin-top: 28px;
			margin-bottom: 28px;
			display: flex;

			@media only screen and (max-width: 768px) {
				margin-top: 22px;
				margin-bottom: 22px;
				flex-direction: column;
			}

			.start-date-div {
				margin-right: 20px;

				@media only screen and (max-width: 768px) {
					margin-right: 0;
					margin-bottom: 14px;
				}
			}

			.input-label {
				margin-bottom: 212px !important;
			}

			.react-calendar__tile--now {
				background-color: rgba(229, 0, 122, 0.1);
			}
		}

		.date-input {
			width: 100%;
			margin-top: 2px;
			font-family: 'Roboto' !important;
			height: 38px !important;
	
			&.error {
				.react-date-picker__wrapper {
					border: #FF0000 1px solid;
					color: #FF0000 !important;
				}
	
				.react-date-picker__inputGroup__input {
					color: #FF0000 !important;
					font-family: 'Roboto' !important;
				}
			}
	
			.react-date-picker__wrapper {
				padding: 0 10px;
				border: 1px solid rgba(34,36,38,.15);
				border-radius: .29rem;
	
				.react-date-picker__inputGroup {
					display: flex;
	
					.react-date-picker__inputGroup__divider {
						height: 100%;
						display: flex;
						align-items: center;
					}
				}
	
			}
	
			.react-date-picker__clear-button {
				svg {
					stroke: #aaa !important;
					height: 14px;
				}
			}
	
			.react-date-picker__inputGroup__input {
				border: none !important;
				font-family: 'Roboto' !important;
				color: #333;
				height: min-content;
				margin-bottom: 0 !important;
			}
	
			.react-date-picker__inputGroup__divider,.react-date-picker__inputGroup__day, .react-date-picker__inputGroup__month, .react-date-picker__inputGroup__year {
				font-size: 14px;
				padding-left: 1px !important;
				padding-right: 1px !important;
			}
		}

		.form-actions{
			display: flex;
			justify-content: flex-end;
			margin-top: 16px;

			.button {
				font-weight: 600;
				font-size: 16px;

				&:first-of-type {
					background: transparent;
				}
			}

			.submit-btn {
				background: #E5007A;
				color: #fff;
			}
			
		}
	}

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

.cal-heading-div {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-right: 10px;

	.mobile-network-select {
		display: none;
		margin-top: 2rem;
		color: #E5007A;
		font-size: 14px;
	
		label {
			display: none !important;
		}
		
		.filter-by-chain-div {
			background-color: #fff;
			border-radius: 5px;
			border: 1px solid #ddd;
			padding: 2px;
		}

		.filter-by-chain-div > .dropdown {
			display: flex;
			align-items: center;
			padding: 3px 10px;
		}
	
		@media only screen and (max-width: 768px) {
			display: flex;
			align-items: center;
		}
	}

	@media only screen and (min-width: 768px) {
		h1 {
			display: none;
		}
	}
}


.events-calendar {
	height: 88vh;
	width: 99%;
	max-width: 1920px;
	
	@media only screen and (max-width: 768px) {
		width: 100%;
		max-width: 100%;
		padding: 1em 0 1em 0;
		max-height: 650px;
	}

	.rbc-toolbar {
		@media only screen and (max-width: 576px) {
			flex-direction: column;

			span {
				margin-bottom: 1em;
			}
		}
	}

	.rbc-show-more {
		color: #E5007A;
		margin-top: 6px;
	}

	.custom-calendar-toolbar,
	.rbc-month-view,
	.rbc-time-view,
	.rbc-agenda-view  {
		background: #fff;
		border: none;
	}
	
	.rbc-month-view,
	.rbc-time-view,
	.rbc-agenda-view  {
		padding: 10px 10px;
	}

	.custom-calendar-toolbar {
		height: 77px;
		padding: 6px 26px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom: 1px solid #E8E8E8;
		display: flex;
		align-items: center;

		.select-div {
			&:nth-of-type(2) {
				padding-left: 19px;
			}

			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 65px;
			border-right: 1px solid #E8E8E8;
			padding-right: 19px;

			label {
				font-size: 14px;
				margin-bottom: 8px;
			}

			.dropdown {
				color: #E5007A;
			}

			&.filter-by-chain-div {
				.dropdown {
					display: flex;
					align-items: center;
				}
			}
		}

		.date-text {
			margin-left: 24px;
			margin-right: 16px;
			font-size: 20px;
			color: #787878;
			width: 140px;
			min-width: 140px;
			max-width: 140px;
		}

		.mobile-cal-nav {
			display: flex;
			margin-left: 2px;

			.button {
				padding: 0 !important
			}
		}

		.button {
			background: none;
			padding: 8px;
			font-size: 14px;

			&:hover {
				background: #eee;
			}
		}

		span {
			word-wrap: none;
			white-space: nowrap;
		}

		.search-btn {
			margin-left: auto;
			margin-right: 22px;
			font-size: 20px;
		}

		.right-actions {
			display: flex;
			align-items: center;
			margin-left: auto;

			.legend-trigger {
				margin-right: 16px;
				color: #E5007A;
				font-weight: 500;
				font-size: 16px;
			}

			.today-btn {
				/* margin-right: 22px; */
				border-radius: 5px;
				font-size: 16px;
				padding: 10px 20px !important;
	
				@media only screen and (max-width: 576px) {
					margin-right: 8px;
				}
			}

			.btn-disabled {
				border: rgba(229, 0, 122, 0.5) !important;
				color: rgba(229, 0, 122, 0.5) !important;
				cursor: default;
			}
		}

		
		.create-event-btn {
			border-radius: 5px;
			border: solid 1px #E5007A;
			color: #E5007A !important;
			font-size: 16px;
			padding: 10px 20px !important;
			margin-right: 0 !important;
			font-weight: 500;

			@media only screen and (max-width: 768px) {
				margin-right: 8px;
			}
		}

		&.small {
			height: auto;
			padding: 10px 2%;
			border-bottom: none;
			justify-content: space-between;
			border-top-left-radius: 0;
			border-top-right-radius: 0;

			.actions-right {
				display: flex;
				align-items: center;
			}
			
			.today-btn-img {
				cursor: pointer;
				margin-right: 8px;
			}

			.select-month-dropdown, .select-view-dropdown {
				padding-left: 5px !important;
				border: 2px solid #eee;
				border-radius: 5px;
				padding: 2px;
				font-size: 12px;
				white-space: nowrap;

				.icon {
					padding-right: 2px !important;
				}
			}

			.select-month-dropdown {
				width: 85px;
				min-width: 85px;
				max-width: 85px;
			}

			.create-event-btn {
				padding: 6px 6px !important;
				font-size: 12px;
				margin-left: 8px;
			}
		}

	}

	&.small {
		.custom-calendar-toolbar {
			margin-bottom: 2px !important;
		}

		.rbc-month-view,
		.rbc-time-view,
		.rbc-agenda-view  {
			padding: 0 !important;
		}

		.rbc-time-header-cell {
			.rbc-header {

				&.rbc-today {
					.week-header-text {
						.day-num {
							background-color: #E6007A;
							color: #fff;
							width: 24px;
							height: 24px;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius: 50%;
						}
					}
				}

				.week-header-text {
					.day-num {
						font-size: 14px;
					}
				}
			}
		}

		.rbc-date-cell {
			button {
				font-size: 12px;
				font-weight: 500 !important;
			}
		}
	}

	.rbc-month-header {
		height: 44px;
		display: flex;
		align-items: center;
		border-bottom: 2px solid #eee;

		.rbc-header {
			font-size: 16px;
			font-weight: 400 !important;
			border: none !important;
			text-align: left;
			margin-left: 2px;
		}
	}

	.rbc-time-header-cell {
		min-height: inherit;

		.rbc-header {
			border-bottom: none;
			border-left: none;
			padding-top: 6px;
			padding-bottom: 13px;

			.week-header-text {
				height: min-content;
				color: #787878;
				font-family: 'Roboto' !important;
	
				.day-of-week {
					text-transform: uppercase;
					font-size: 12px;
					margin-bottom: 8px;
					font-weight: 500;
				}
	
				.day-num {
					font-size: 22px;
				}
			}
		}
	}

	.rbc-date-cell {
		button {
			font-size: 15px;
			padding: 5px;
			font-weight: 600 !important;
		}

		&.rbc-now {
			button {
				background-color: #E6007A;
				color: #fff;
				border: 1px solid #E6007A;
				border-radius: 50%;
			}
		}
	}

	.rbc-time-header-content {
		border-left: none;
	}

	.rbc-off-range-bg {
		background: #fff !important;
	}

	.rbc-off-range {
		color: #CFCFCF;
	}

	.rbc-date-cell {
		text-align: left;
		padding: 5px 8px;
	}

	.rbc-time-header-gutter {
		display: flex;
		align-items: end;
		justify-content: center;
		text-align: center;
		font-weight: 400;
		font-size: 12px;
		color: #777777;
		padding-bottom: 4px;

		.day-num {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #E6007A;
			color: #fff;
			height: 26px;
			width: 26px;
			border-radius: 50%;
			font-size: 14px;
		}
	}

	.rbc-timeslot-group {
		padding-left: 10px;
		padding-right: 10px;
		font-size: 12px;
		color: #777777;
	}

	.rbc-month-row {
		.rbc-day-bg.rbc-today {
			border: 1px solid #E6007A;
			background-color: #fff;
		}
	}

	.rbc-today {
		background-color: rgba(229, 0, 122, 0.02);

		.week-header-text {
			color: #E5007A !important;
		}
	}

	.rbc-events-container {
		.custom-event-wrapper{
			.rbc-event {
				border: 1px solid #E6007A;
				border-left: 4px solid #E6007A;
				display: flex;
				justify-content: center;
				padding-top: 4px;

				.rbc-event-label {
					display: none;
				}

				&.overdue-border {
					border: 1px solid #FF0000 !important;
					border-left: 4px solid #FF0000 !important;
				}

				&.completed-border {
					border: 1px solid #5BC044 !important;
					border-left: 4px solid #5BC044 !important;
				}

				&.in_progress-border {
					border: 1px solid #EA8612 !important;
					border-left: 4px solid #EA8612 !important;
				}
			}
		}
	}

	.custom-event-wrapper{
		.rbc-event {
			background-color: #fff;
			border-radius: 0;
			color: #000;
			font-weight: 500;
			font-size: 12px;
			border-left: 4px solid #E6007A;

			.event-container-span {
				cursor: pointer;
			}

			&.overdue-border {
				border-left: 4px solid #FF0000 !important;
			}

			&.completed-border {
				border-left: 4px solid #5BC044 !important;
			}

			&.in_progress-border {
				border-left: 4px solid #EA8612 !important;
			}
	
			.event-time {
				margin-right: 5px;
				font-weight: 400;
				color: #747474;
			}
	
			&:focus {
				outline: none;
			}
		}
	}


	.rbc-current-time-indicator {
		background-color: #E6007A;
	}
}

.pt-0 {
	padding-top: 0 !important;
}

`;
