// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useState } from 'react';
import { Button, Icon, Input, Modal } from 'semantic-ui-react';

import ProposalFormButton from './ProposalFormButton';

interface Props {
	className?: string
	proposalType?: string,
}

const CreateProposalButton = ({ className, proposalType } : Props) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [postInputVisible, setPostInputVisible] = useState<boolean>(false);
	const [linkError, setLinkError] = useState<string>('');
	const [postID, setPostID] = useState<string>('');

	const handleLinkPost = () => setLinkError(postID + ' : This post is not linked to your wallet/profile');

	return (
		<Modal
			className={className}
			closeOnEscape={false}
			closeOnDimmerClick={false}
			closeIcon
			onClose={() => { setModalOpen(false); setPostInputVisible(false); setLinkError(''); setPostID(''); }}
			onOpen={() => setModalOpen(true)}
			open={modalOpen}
			size='tiny'
			trigger={<Button style={ { background: '#E5007A', color:'#fff', textTransform: 'capitalize' } } size='huge'> <Icon name='plus circle' /> Create {proposalType} Proposal</Button>}
		>
			<Modal.Header className='modal-header text-center'>
				Create {proposalType} Proposal
			</Modal.Header>
			<Modal.Content scrolling className='text-center'>
				<Modal.Description>
					<h5>Hey, have you created a discussion post already ?</h5>
					<p>You can link the discussion post to pull post content and comments do this proposal post</p>

					<div className='actionDiv'>
						{
							!postInputVisible ?
								<Button size='big' onClick={() => setPostInputVisible(true)} className='link-btn'>Yes! Link Post</Button>
								:
								<>
									<Input
										action={
											<Button size='big' onClick={handleLinkPost} className='link-btn'>Link</Button>
										}
										type='number'
										min='1'
										placeholder='Enter Post ID'
										error={!!linkError}
										onChange={ (e) => setPostID(e.target.value as string)}
									/>
									<div className='link-error-div'>
										{linkError ? linkError : null}
									</div>
								</>
						}
					</div>

					<div className='proceed-manually-div'>
						<ProposalFormButton
							setTipModalOpen={setModalOpen}
							proposalType={proposalType}
						/>
					</div>
				</Modal.Description>
			</Modal.Content>
		</Modal>

	);

};

export default styled(CreateProposalButton)`
	.create-tip-button{
		background-color: #fff;
		color: #000;
		border: 1.56px solid #E5007A;
		border-radius: 0.5em;
		box-shadow: 2px 7px 11px -10px rgba(229,0,122,0.75);
		-webkit-box-shadow: 2px 7px 11px -10px rgba(229,0,122,0.75);
		-moz-box-shadow: 2px 7px 11px -10px rgba(229,0,122,0.75);
	}

	.create-tip-button:hover, .create-tip-button:focus{
		color: #000;
		background-color: #fff;
		ox-shadow: 2px 7px 11px -5x rgba(229,0,122,0.75);
		-webkit-box-shadow: 2px 7px 11px -5px rgba(229,0,122,0.75);
		-moz-box-shadow: 2px 7px 11px -5px rgba(229,0,122,0.75);
	}

	.modal-header{
		text-transform: capitalize;
	}

	.text-center  {
		text-align : center;
	}

	.close-btn {
		background: transparent;
		float: right;
	}

	.link-btn, .link-btn:hover, .link-btn:focus {
		background-color: #e5007a;
		color: #fff;
	}

	.actionDiv {
		margin-top: 1.5em;
	}

	.proceed-manually-div, .link-error-div {
		margin-top: 0.5em;
	}

	.link-error-div {
		color: #DB2841;
	}

	.proceed-manually-btn {
		background-color: transparent;
		color: #333;
		text-decoration: underline;
	}

	/* Hides Increment Arrows in number input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type=number] {
		-moz-appearance: textfield;
	}

`;
