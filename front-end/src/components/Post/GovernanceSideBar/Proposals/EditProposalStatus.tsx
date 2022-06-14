// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect,useState } from 'react';
import DatePicker from 'react-date-picker';
import { Button, Dropdown, Form, Icon, Modal } from 'semantic-ui-react';
import { useGetProposalStatusQuery } from 'src/generated/graphql';
import HelperTooltip from 'src/ui-components/HelperTooltip';

import { ReactComponent as CalendarIcon } from '../../../../assets/sidebar/calendar.svg';

interface Props {
	className?: string
	proposalId?: number | null | undefined
}

const statusOptions = [
	{ key: 'overdue', text: 'Overdue', value: 'overdue' },
	{ key: 'completed', text: 'Completed', value: 'completed' },
	{ key: 'in_progress', text: 'In Progress', value: 'in_progress' }
];

const EditProposalStatus = ({ className, proposalId } : Props) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [deadlineDate, setDeadlineDate] = useState<Date>(new Date());
	const [errorsFound, setErrorsFound] = useState<string[]>(['']);

	const { data, refetch } = useGetProposalStatusQuery({ variables: {
		onchain_proposal_id: Number(proposalId)
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		console.log('data : ', data);
	}, [data]);

	const handleSave = () => {
		const errorsFound: string[] = [''];

		if(Object.prototype.toString.call(deadlineDate) !== '[object Date]') {
			errorsFound.push('deadlineDate');
		}
		setErrorsFound(errorsFound);

		// createProposalTrackerMutation()

	};

	return (
		<Modal
			className={className}
			closeOnEscape={false}
			closeOnDimmerClick={false}
			onOpen={() => setModalOpen(true)}
			open={modalOpen}
			size='small'
			trigger={<Button style={ { background: '#E5007A', color:'#fff', marginBottom:'12px' } } size='huge'> <Icon name='edit outline' /> Edit Proposal Status</Button>}
		>
			<Modal.Header className='modal-header'>
				<div>Edit Proposal Status </div>
				<Icon name='close' onClick={() => setModalOpen(false)} />
			</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<Form.Group>
						<Form.Field width={16} className='date-input-form-field'>
							<label className='input-label'>
								Choose Deadline Date
								<HelperTooltip content='This timeline will be used by the community to track the progress of the proposal. The team will be responsible for delivering the proposed items before the deadline.' iconSize='small' />
							</label>

							<DatePicker className={`date-input ${errorsFound.includes('deadlineDate') ? 'deadline-date-error' : ''}`} onChange={setDeadlineDate} value={deadlineDate} calendarIcon={<CalendarIcon />} format='d-M-yyyy' />
						</Form.Field>

						<Form.Field width={16} className='status-input-form-field'>
							<label className='input-label'>
								Status
							</label>

							<Dropdown placeholder='Status' className='status-dropdown' search selection clearable options={statusOptions} />
						</Form.Field>

					</Form.Group>
				</Modal.Description>
			</Modal.Content>

			<Modal.Actions>
				<Button onClick={handleSave}>
          Save
				</Button>
			</Modal.Actions>
		</Modal>

	);

};

export default styled(EditProposalStatus)`
	.modal-header{
		display: flex !important;
		align-items: center;
		justify-content: center;

		div, .icon {
			margin-left: auto;
		}

		.icon {
			cursor: pointer;
			color: #999;

			&:hover {
				color: #333;
			}
		}
	}

	.description {
		padding: 0 5%;
	}

	.actions {
		margin-top: 10px;

		.button {
			background: #E5007A !important;
			color: #fff;
		}
	}

	.input-label {
		display: flex !important;
		align-items: center !important;
		font-size: 12px;
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
			padding: 0.678571em 1em;
			border: 1px solid rgba(34,36,38,.15);
			border-radius: .29rem;
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
		}

		.react-date-picker__inputGroup__divider,.react-date-picker__inputGroup__day, .react-date-picker__inputGroup__month, .react-date-picker__inputGroup__year {
			font-size: 14px;
			padding-left: 1px !important;
			padding-right: 1px !important;
		}
	}

	.status-input-form-field {
		margin-top: 16px;

		.input-label {
			margin-bottom: 4px;
		}

		.status-dropdown {
			font-size: 14px;
			width: 100%;
		}
	}
`;
