// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import BN from 'bn.js';
import React, { useState } from 'react';

import { inputToBn } from '../util/inputToBn';
import { Form } from './Form';
import HelperTooltip from './HelperTooltip';
import Input from './Input';

interface Props{
	className?: string
	label?: string
	helpText?: string
	onChange: (balance: BN) => void
	placeholder?: string
	iconSize?: 'small' | 'normal'
}

const BalanceInput = ({ className, label = '', helpText = '', onChange, placeholder = '', iconSize }: Props) => {
	const [isValidInput, setIsValidInput] = useState(true);
	const onBalanceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const [balance, isValid] = inputToBn(event.currentTarget.value, false);
		setIsValidInput(isValid);

		if(isValid){
			onChange(balance);
		}
	};

	return <Form.Field className={className} width={16}>
		<label>
			{label}
			{helpText && <HelperTooltip content={helpText} iconSize={iconSize}/>}
		</label>
		<Input
			className={'balanceInput'}
			invalid={isValidInput}
			onChange={onBalanceChange}
			placeholder={placeholder}
			type='number'
		/>
	</Form.Field>;
};

export default styled(BalanceInput)`
	label {
		display: flex !important;
    align-items: center !important;
	}

	.ui.selection.dropdown {
		border-color: grey_light;
	}
`;
