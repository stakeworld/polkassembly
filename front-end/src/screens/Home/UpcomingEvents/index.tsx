// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Grid, Icon, List } from 'semantic-ui-react';
import CalendarView from 'src/screens/CalendarView';

import calendarImg from '../../../assets/calendar.png';

interface Props {
  className?: string
}

const UpcomingEvents = ({ className }: Props) => {
	const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
	const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
	const [eventsList, setEventsList] = useState<any[]>([]);

	useEffect(() => {
		const listItems: any[] = [];
		calendarEvents.forEach(eventObj => {
			listItems.push(
				<List.Item className='news-list-item' key={eventObj.id}>
					<List.Content>
						<List.Description className='list-item-date'>
							{moment(eventObj.start_time).format('MMMM Do YYYY, h:mm:ss a')}
						</List.Description>
						<List.Header className='list-item-title'>{eventObj.title}</List.Header>
					</List.Content>
				</List.Item>
			);
		});

		setEventsList(listItems);
	}, [calendarEvents]);

	const toggleCalendar = () => {
		setCalendarVisible(!calendarVisible);
	};

	return (
		<div className={className}>
			<h1>Upcoming Events</h1>
			<div className="card">
				<Grid stackable>
					<Grid.Row className='action-bar-row'>
						<Grid.Column className='action-bar' width={16}>
							{calendarVisible ?
								<Icon onClick={toggleCalendar} className='calendar-btn-img' name='list layout' /> :
								<img className='calendar-btn-img' onClick={toggleCalendar} src={calendarImg} height={16} width={16} title='Toggle Calendar' alt='Toggle Calendar' />
							}
						</Grid.Column>
					</Grid.Row>
					{/* <Grid.Row className='event-filter-row'>
						<Grid.Column className='event-filter-bar' width={16}>
							<Checkbox className='event-checkbox' label='&nbsp;Auction' />
							<Checkbox className='event-checkbox' label='&nbsp;Update' />
							<Checkbox className='event-checkbox' label='&nbsp;Community' />
							<Checkbox className='event-checkbox' label='&nbsp;Launch' />
							<Checkbox className='event-checkbox' label='&nbsp;Miscellaneous' />
						</Grid.Column>
					</Grid.Row> */}
					<Grid.Row className='event-content-row'>
						<Grid columns={2} className='event-content-row'>
							<Grid.Column className={`event-list-col ${calendarVisible ? 'd-sm-none' : ''}`} mobile={16} tablet={16} computer={6}>
								{eventsList.length > 0 &&
									<List relaxed='very' divided>
										{ eventsList }
									</List>
								}
							</Grid.Column>
							<Grid.Column className={`event-calendar-col ${calendarVisible ? '' : 'd-sm-none'}`} mobile={16} tablet={16} computer={10}>
								<CalendarView className='event-calendar-small' small={true} emitCalendarEvents={setCalendarEvents} />
							</Grid.Column>
						</Grid>
					</Grid.Row>

					<Grid.Row className='info-bar-row'>
						<Grid.Column className='info-bar-col' width={16}>
							<p>*Time in UTC</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</div>
	);
};

export default styled(UpcomingEvents)`
	.card {
		background: #fff;
		border-radius: 10px;
		height: 500px;
		max-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		@media only screen and (max-width: 991.5px) {
			height: fit-content;
			max-height: fit-content;
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.info-bar-row {
			color: #75767C;
			@media only screen and (min-width: 991.5px) {
				margin-left: 16px;
			}
		}
		
		.grid {
			width: 100%;
			height: 490px;
		}
		
		.action-bar-row {
			display: flex !important;

			@media only screen and (min-width: 991.5px) {
				display: none !important;
			}
						
			.action-bar {
				display: flex !important;
				justify-content: end !important;
				border-bottom: 2px #eee solid;
				padding-bottom: 1em;
	
				.calendar-btn-img {
					cursor: pointer;
					color: #778192;
				}
			}
		}


		.event-filter-row, .event-content-row{
			padding-bottom: 0;
			padding-top: 0;
		}

		.event-content-row {
			justify-content: center;
			height: 460px;
			@media only screen and (max-width: 991.5px) {
				height: 400px;
			}
		}
		
		.event-filter-bar {
			border-bottom: 2px #eee solid;
			padding-bottom: 1em;

			.event-checkbox {
				margin-right: 2em !important;
				margin-top: 1em !important;
			}
		}

		.event-list-col {
			overflow-y: auto;
			height: 460px;
			max-height: 460px;
			border-right: 2px #eee solid;

			@media only screen and (max-width: 991.5px) {
				max-height: 400px !important;
			}
		}
		
		.event-list-col, .event-calendar-col{
			padding-top: 1em;
		}

		.event-calendar-col{
			height: 490px;
			max-height: 490px;

			@media only screen and (max-width: 991.5px) {
				height: 420px;
				max-height: 420px !important;
				padding-top: 0 !important;
			}

			.event-calendar-small {
				overflow-y: hidden;
				overflow-x: hidden;

				.events-calendar {
					margin-left: 16px;
					padding: 0;
					height: 460px;
					width: 98.6%;

					@media only screen and (max-width: 991.5px) {
						height: 410px;
						max-height: 400px !important;
						margin-left: 8px;
					}

					.custom-calendar-toolbar {
						margin: 0 0 1.5em 0.1em;

						.action-div {
							span {
								margin-left: 3px;
							}
						}
					}
				}
			}
	}

		.news-list-item {
			display: flex;

			.list-item-date {
				margin-left: 0.6em;
				color: #75767C;
				font-size: 0.88em;
			}

			.list-item-title {
				margin-left: 0.6em;
				font-weight: 500;
				font-size: 1.1em;
				margin-top: 0.2em;
			}
		}

		.d-sm-none {
			@media only screen and (max-width: 991.5px) {
				display: none !important;
			}
		}
	}
`;
