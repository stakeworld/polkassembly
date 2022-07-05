// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { ApolloQueryResult } from 'apollo-client';
import React, { useContext, useState } from 'react';
import DatePicker from 'react-date-picker';
import { Button, CheckboxProps, Form, Input } from 'semantic-ui-react';
import { NotificationContext } from 'src/context/NotificationContext';
import { Exact, GetCalenderEventsQuery, useAddCalenderEventMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';

import { ReactComponent as CalendarIcon } from '../../assets/sidebar/calendar.svg';

interface Props {
  className?: string
	routeWrapperHeight: number
	setSidebarCreateEvent: React.Dispatch<React.SetStateAction<boolean>>
	selectedNetwork: string
	refetch: (variables?: Exact<{
			network: string;
			approval_status: string;
	}> | undefined) => Promise<ApolloQueryResult<GetCalenderEventsQuery>>
	id:  number | null | undefined
}

const CreateEventSidebar = ({ className, routeWrapperHeight, refetch, selectedNetwork, setSidebarCreateEvent, id }: Props) => {
	const [eventTitle, setEventTitle] = useState<string>('');
	const [eventDescription, setEventDescription] = useState<string>('');
	const [eventType, setEventType] = useState<string>('online');
	const [eventStartDateTime, setEventStartDate] = useState<Date | undefined>();
	const [eventEndDateTime, setEventEndDate] = useState<Date | undefined>();
	const [eventJoiningLink, setEventJoiningLink] = useState<string>('');
	const [eventLocation, setEventLocation] = useState<string>('');
	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	const { queueNotification } = useContext(NotificationContext);

	const [addCalenderEventMutation, { loading }] = useAddCalenderEventMutation({
		variables: {
			content: eventDescription,
			end_time: eventEndDateTime,
			event_type: eventType,
			module: '',
			network: selectedNetwork,
			start_time: eventStartDateTime,
			title: eventTitle,
			url: eventJoiningLink,
			user_id: id
			// location: eventLocation
		}
	});

	const onEventTypeRadioToggle = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setEventType(data.value?.toString() || 'online');
	};

	const closeCreateEventSidebar = () => {
		setSidebarCreateEvent(false);
		setEventTitle('');
		setEventDescription('');
		setEventType('online');
		setEventStartDate(undefined);
		setEventEndDate(undefined);
		setEventJoiningLink('');
	};

	function isFormValid(){
		const errorsFoundTemp: string[] = [];

		if(!eventTitle) {
			errorsFoundTemp.push('eventTitle');
		}

		if(!eventDescription) {
			errorsFoundTemp.push('eventDescription');
		}

		if(!eventStartDateTime) {
			errorsFoundTemp.push('eventStartDateTime');
		}

		if(!eventEndDateTime) {
			errorsFoundTemp.push('eventEndDateTime');
		}

		if(eventType == 'online' && !eventJoiningLink) {
			errorsFoundTemp.push('eventJoiningLink');
		} else if(eventType == 'offline' && !eventLocation) {
			errorsFoundTemp.push('eventLocation');
		}

		setErrorsFound(errorsFoundTemp);

		if(errorsFoundTemp.length > 0 ){
			return false;
		}

		return true;
	}

	const handleCreateEvent = () => {
		if(!isFormValid() || !id) return;

		addCalenderEventMutation({
			variables: {
				content: eventDescription,
				end_time: eventEndDateTime,
				event_type: eventType,
				module: '',
				network: selectedNetwork,
				start_time: eventStartDateTime,
				title: eventTitle,
				url: eventJoiningLink,
				user_id: id
				// location: eventLocation
			}
		})
			.then(({ data }) => {
				if (data && data.insert_calender_events && data.insert_calender_events.affected_rows > 0){
					closeCreateEventSidebar();
					queueNotification({
						header: 'Success!',
						message: 'Event saved successfully',
						status: NotificationStatus.SUCCESS
					});
					refetch();
				}
			})
			.catch((e) => {
				queueNotification({
					header: 'Error!',
					message: 'Error saving event',
					status: NotificationStatus.ERROR
				});
				console.error('Error saving event :', e);
			});
	};

	return (
		<div className={className} style={ { maxHeight: `${routeWrapperHeight}px`, minHeight: `${routeWrapperHeight}px` } }>
			<div className="create-event-sidebar-header d-flex">
				<div className='d-flex'>
					<h1>Create Event</h1>
				</div>
			</div>

			<div className="create-event-form">
				<Form>
					<Form.Field>
						<label className='input-label'>Event Title</label>
						<Input
							type='text'
							className='text-input'
							value={eventTitle}
							onChange={(e) => setEventTitle(e.target.value)}
							error={errorsFound.includes('eventTitle')}
							disabled={loading}
						/>
					</Form.Field>

					<Form.Field>
						<label className='input-label'>Description</label>
						<Input
							type='text'
							className='text-input'
							value={eventDescription}
							onChange={(e) => setEventDescription(e.target.value)}
							error={errorsFound.includes('eventDescription')}
							disabled={loading}
						/>
					</Form.Field>

					<label className='input-label'>Event Type</label>
					<Form.Group className='radio-input-group'>
						<Form.Radio
							label='Online'
							value='online'
							checked={eventType === 'online'}
							onChange={onEventTypeRadioToggle}
							disabled={loading}
						/>
						<Form.Radio
							label='Offline'
							value='offline'
							checked={eventType === 'offline'}
							onChange={onEventTypeRadioToggle}
							disabled={loading}
						/>
					</Form.Group>

					<div className="d-flex date-input-row">
						<div className='start-date-div'>
							<label className='input-label'>Start Date</label>
							<DatePicker
								className={`date-input ${errorsFound.includes('eventStartDateTime') ? 'error' : ''}`}
								onChange={setEventStartDate}
								value={eventStartDateTime}
								minDate={new Date()}
								calendarIcon={<CalendarIcon />}
								format='d-M-yyyy'
								disabled={loading}
							/>
						</div>

						<div>
							<label className='input-label'>End Date</label>
							<DatePicker
								className={`date-input ${errorsFound.includes('eventEndDateTime') ? 'error' : ''}`}
								onChange={setEventEndDate}
								value={eventEndDateTime}
								minDate={eventStartDateTime}
								calendarIcon={<CalendarIcon />}
								format='d-M-yyyy'
								disabled={loading}
							/>
						</div>
					</div>

					{eventType == 'online' ? <Form.Field>
						<label className='input-label'>Joining Link</label>
						<Input
							type='text'
							className='text-input'
							value={eventJoiningLink}
							onChange={(e) => setEventJoiningLink(e.target.value)}
							error={errorsFound.includes('eventJoiningLink')}
							disabled={loading}
						/>
					</Form.Field>
						:
						<Form.Field>
							<label className='input-label'>Location</label>
							<Input
								type='text'
								className='text-input'
								value={eventLocation}
								onChange={(e) => setEventLocation(e.target.value)}
								error={errorsFound.includes('eventLocation')}
								disabled={loading}
							/>
						</Form.Field>
					}

					<div className="form-actions">
						<Button content='Cancel' onClick={closeCreateEventSidebar} disabled={loading} />
						<Button content='Create Event' className='submit-btn' onClick={handleCreateEvent} loading={loading} />
					</div>
				</Form>
			</div>
		</div>
	);
};

export default CreateEventSidebar;
