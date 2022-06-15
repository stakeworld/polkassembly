// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import moment from 'moment';
import React, { useContext, useEffect,useState } from 'react';
import DatePicker from 'react-date-picker';
import { Button, Card, Dropdown, DropdownProps, Form, Message } from 'semantic-ui-react';
import { NotificationContext } from 'src/context/NotificationContext';
import { useGetProposalStatusQuery } from 'src/generated/graphql';
import { getLocalStorageToken } from 'src/services/auth.service';
import { NotificationStatus } from 'src/types';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import getNetwork from 'src/util/getNetwork';

import { ReactComponent as CalendarIcon } from '../../../../assets/sidebar/calendar.svg';

interface Props {
	canEdit?: boolean | '' | undefined
	className?: string
	address: string
	proposalId?: number | null | undefined
}

const statusOptions = [
	{ key: 'overdue', text: 'Overdue', value: 'overdue' },
	{ key: 'completed', text: 'Completed', value: 'completed' },
	{ key: 'in_progress', text: 'In Progress', value: 'in_progress' }
];

const EditProposalStatus = ({ canEdit, className, address, proposalId } : Props) => {
	const token = getLocalStorageToken();

	const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());
	const [status, setStatus] = useState<string>('in_progress');
	const [loading, setLoading] = useState<boolean>(false);
	const [errorsFound, setErrorsFound] = useState<string[]>([]);

	const NETWORK = getNetwork();
	const DOMAIN_NAME = window.location.hostname;

	const { queueNotification } = useContext(NotificationContext);

	const { data, refetch } = useGetProposalStatusQuery({ variables: {
		onchain_proposal_id: Number(proposalId)
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if(data?.proposal_tracker[0]?.status) {
			setStatus(data?.proposal_tracker[0].status);
		}

		if(data?.proposal_tracker[0]?.deadline) {
			setDeadlineDate(moment(data?.proposal_tracker[0].deadline).toDate());
		}

	}, [data]);

	const onStatusChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const status = data.value as string;
		setStatus(status);
	};

	const handleSave = async () => {
		if(!canEdit) return;

		setLoading(true);

		const errorsFound: string[] = [];

		if(Object.prototype.toString.call(deadlineDate) !== '[object Date]') {
			errorsFound.push('deadlineDate');
		}

		if(!status){
			errorsFound.push('status');
		}

		setErrorsFound(errorsFound);

		if(errorsFound.length > 0) {
			setLoading(false);
			return;
		}

		const proposalTrackerMutaion = `mutation createProposalTracker($deadline: timestamptz!, $network: String!, $onchain_proposal_id: Int!, $status: String!, $user_id: Int!) {
			insert_proposal_tracker(objects: {deadline: $deadline, network: $network, onchain_proposal_id: $onchain_proposal_id, status: $status, user_id: $user_id}) {
			  affected_rows
			  returning {
				id
			  }
			}
		}`;

		const request = {
			body: JSON.stringify({
				operationName: 'createProposalTracker',
				query: proposalTrackerMutaion,
				variables: {
					deadline: moment(deadlineDate).format('L'),
					network: NETWORK,
					onchain_proposal_id: proposalId,
					status: status,
					user_id: address
				}
			}),
			headers: {
				authorization: `Bearer ${token}`,
				'content-type': 'application/json'
			},
			method: 'POST'
		};

		let api = `https://${DOMAIN_NAME}/v1/graphql`;

		if (DOMAIN_NAME === 'test.polkassembly.io') {
			api = 'https://test.polkassembly.io/v1/graphql';
		}

		const result = await fetch(api, request);

		const json = await result.json();

		if (json.errors) {
			errorsFound.push('proposalTracker');
		}else {
			queueNotification({
				header: 'Success!',
				message: 'Proposal status was edited',
				status: NotificationStatus.SUCCESS
			});
		}

		setLoading(false);
	};

	return (
		<Card
			className={className}
		>
			<Card.Content>
				<div className='card-description'>
					{errorsFound.includes('proposalTracker') && <Message negative>
						<Message.Header>Error in updating proposal status, please try again.</Message.Header>
					</Message>}

					<Form.Group>
						<Form.Field width={16} className='date-input-form-field'>
							<label className='input-label'>
								Deadline Date
								<HelperTooltip content='This timeline will be used by the community to track the progress of the proposal. The team will be responsible for delivering the proposed items before the deadline.' iconSize='small' />
							</label>

							{canEdit ?
								<DatePicker className={`date-input ${errorsFound.includes('deadlineDate') ? 'deadline-date-error' : ''}`} disabled={loading} onChange={setDeadlineDate} value={deadlineDate} calendarIcon={<CalendarIcon />} format='d-M-yyyy' />
								:
								<span className='deadline-date'>{moment(deadlineDate).format('MMMM Do YYYY')}</span>
							}
						</Form.Field>

						<Form.Field width={16} className='status-input-form-field'>
							<label className='input-label'>
								Status
							</label>

							{canEdit ?
								<Dropdown placeholder='Status' className='status-dropdown' disabled={loading} selection options={statusOptions} value={status} onChange={onStatusChange} error={errorsFound.includes('status')} />
								:
								<span>{statusOptions.find(o => o.value === status)?.text}</span>
							}
						</Form.Field>
					</Form.Group>
				</div>

				{ canEdit && <div className='card-actions'>
					<Button onClick={handleSave} loading={loading} disabled={loading}>
						Save
					</Button>
				</div>
				}
			</Card.Content>
		</Card>

	);

};

export default styled(EditProposalStatus)`
	width: 100% !important;
	padding: 2% 3% !important;

	.header{
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
		margin-bottom: 16px;
	}

	.card-description {
		display: flex;
		flex-direction: column;

		.fields {
			display: block;
		}
	}

	.card-actions {
		margin-top: 10px;
		display: flex;
		justify-content: end;
		
		.button {
			background: #E5007A !important;
			color: #fff;
		}
	}

	.input-label {
		display: flex !important;
		align-items: center !important;
		font-size: 12px;

		span {
			margin-top: -5px;
		}
	}

	.deadline-date {
		font-size: 14px;
	}

	.date-input {
		width: 100%;
		margin-top: 2px;
		font-family: 'Roboto' !important;

		&.deadline-date-error {
			.react-date-picker__wrapper {
				border: #E06B5E 1px solid;
				color: #E06B5E !important;
			}

			.react-date-picker__inputGroup__input {
				color: #E06B5E !important;
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

	.status-input-form-field {
		margin-top: 16px !important;

		.input-label {
			margin-bottom: 4px;
		}

		.status-dropdown {
			font-size: 14px;
			width: 100%;
		}
	}
`;
