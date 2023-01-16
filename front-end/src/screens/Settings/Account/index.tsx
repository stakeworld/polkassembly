// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import { Row, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useUserDetailsContext } from 'src/context';
import Header from 'src/screens/Settings/Header';
import AddressComponent from 'src/ui-components/Address';

import Address from './Address';
import MultiSignatureAddress from './MultiSignatureAddress';
import Proxy from './Proxy';

interface IAddressHeaderProps {
    header?: string;
    id?: string;
    checked?: boolean;
    onChange?: React.Dispatch<React.SetStateAction<boolean>>
}

const AddressHeader: FC<IAddressHeaderProps> = ({ checked, header, id, onChange }) => {
	return (
		<article className='flex items-center gap-x-2 text-sm font-normal tracking-wide leading-6 mb-6'>
			<label className='cursor-pointer' htmlFor={id}>
				{header}
			</label>
			<Switch checked={checked} onChange={(e) => onChange? onChange(e): null} id={id} size='small' defaultChecked />
		</article>
	);
};

interface Props {
	className?: string;
}

const Account: FC<Props> = ({ className }) => {
	const [isLinkAddress, setIsLinkAddress] = useState(false);
	const [isMultiSigAddress, setIsMultiSigAddress] = useState(false);
	const [isLinkProxy, setIsLinkProxy] = useState(false);
	const currentUser = useUserDetailsContext();
	const [addresses, setAddresses] = useState<string[]>([]);
	useEffect(() => {
		setAddresses(Array.from(new Set(currentUser.addresses)));
	}, [currentUser.addresses]);

	return (
		<Row className={`${className} flex flex-col w-full`}>
			<Header heading='Account Settings' subHeading='Update your account settings' />
			<div className='mt-8'>
				<section>
					<AddressHeader
						checked={isLinkAddress}
						header='Link Address'
						id='link_address'
						onChange={setIsLinkAddress}
					/>
					<Address
						open={isLinkAddress}
						dismissModal={() => setIsLinkAddress(false)}
					/>
				</section>
				<section>
					<AddressHeader
						checked={isMultiSigAddress}
						header='Link Multi Signature Address'
						id='link_multi_address'
						onChange={setIsMultiSigAddress}
					/>
					<MultiSignatureAddress
						open={isMultiSigAddress}
						dismissModal={() => setIsMultiSigAddress(false)}
					/>
				</section>
				<section>
					<AddressHeader
						checked={isLinkProxy}
						header='Link Proxy Address'
						id='link_proxy'
						onChange={setIsLinkProxy}
					/>
					<Proxy
						open={isLinkProxy}
						dismissModal={() => setIsLinkProxy(false)}
					/>
				</section>
				{addresses.length > 0? <section>
					<p className='text-sm font-normal tracking-wide leading-6'>
						Linked Addresses
					</p>
					<ul className='list-none flex flex-col gap-y-3 mt-3'>
						{addresses.map((address) => {
							return (
								<li key={address}>
									<AddressComponent
										address={address}
									/>
								</li>
							);
						})}
					</ul>
				</section>: null}
			</div>
		</Row>
	);
};

export default styled(Account)`
	.ant-switch-checked {
		background-color: green_primary !important;
	}
`;