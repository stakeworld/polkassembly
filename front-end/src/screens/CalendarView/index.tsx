// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import 'react-big-calendar/lib/css/react-big-calendar.css';

import styled from '@xstyled/styled-components';
// import moment from 'moment';
import React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Grid } from 'semantic-ui-react';

// declare global {
// interface Window { gapi: any; }
// }
// window.gapi = window.gapi || {};

interface Props {
  className?: string
}

// const localizer = momentLocalizer(moment);

// const iframe = '<iframe src="https://calendar.google.com/calendar/embed?src=events%40polkassembly.io&ctz=Asia%2FKolkata" style="border: 0" frameborder="0" scrolling="no"></iframe>';

// function Iframe(props: any) {
// return (<div dangerouslySetInnerHTML={ { __html:  props.iframe?props.iframe:'' } } />);
// }

const CalendarView = ({ className }: Props) => {
	// const myEventsList = [
	// { end: new Date(), start: new Date(), title: 'Test Event' }
	// ];

	// const [events, setEvents] = useState(null);

	// useEffect(() => {
	// function getEvents(){
	// function start() {
	// window.gapi.client.init({
	// 'apiKey': ''
	// }).then(function() {
	// return window.gapi.client.request({
	// 'path': 'https://www.googleapis.com/calendar/v3/calendars/events@polkassembly.io/events'
	// });
	// }).then( (response: any) => {
	// const events = response.result.items;
	// setEvents(events);
	// }, function(reason: any) {
	// console.log(reason);
	// });
	// }
	// window.gapi.load('client', start);
	// }

	// const script = document.createElement('script');
	// script.async = true;
	// script.defer = true;
	// script.src = 'https://apis.google.com/js/api.js';

	// document.body.appendChild(script);

	// script.addEventListener('load', () => {
	// if (window.gapi) getEvents();
	// });
	// });

	return (
		<div className={className}>
			<h1>Calendar</h1>
			<Grid stackable>
				{/* <Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={14} className='calendar-col'>
						<Calendar
							localizer={localizer}
							events={myEventsList}
							startAccessor='start'
							endAccessor='end'
							style={{ height: 500 }}
						/>
					</Grid.Column>
				</Grid.Row> */}
				<Grid.Row>
					<Grid.Column mobile={16} tablet={16} computer={14} className='calendar-col'>
						<p className="coming-soon-text">
							Coming Soon
						</p>
						{/* <div className="iframe-wrapper">
							<Iframe iframe={iframe} />
						</div> */}
					</Grid.Column>
				</Grid.Row>
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

.calendar-col {
	background: #fff;
	padding: 1em;
	border-radius: 5px;
}

.iframe-wrapper {
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	padding-top: 25px;
	height: 0;
}
.iframe-wrapper iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
`;
