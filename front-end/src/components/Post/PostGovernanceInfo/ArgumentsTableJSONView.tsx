// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
// import ReactJson from 'react-json-view';
import { Button } from 'semantic-ui-react';
import ArgumentsTable from 'src/components/ArgumentsTable';
import formatPostInfoArguments from 'src/util/formatPostInfoArguments';

import AddressComponent from '../../../ui-components/Address';

interface Props {
	className?: string
	postArguments: any
	showAccountArguments: boolean
}
const ArgumentsTableJSONView = ({ className, postArguments, showAccountArguments }: Props) => {
	const [dataViewMode, setDataViewMode] = useState<'table' | 'json'>('table');
	const argumentsArr = formatPostInfoArguments(postArguments);

	if(argumentsArr.length > 0) {
		return (
			<div className={className}>
				<h6 className='arguments-heading mt'> Arguments :
					<Button.Group size='tiny'>
						<Button className={dataViewMode == 'table' ? 'active-btn' : ''} onClick={() => setDataViewMode('table')}>Table</Button>
						<Button className={dataViewMode == 'json' ? 'active-btn' : ''} onClick={() => setDataViewMode('json')}>JSON</Button>
					</Button.Group>
				</h6>

				{
					dataViewMode == 'table' ?
						<div className="table-view">
							<table cellSpacing={0} cellPadding={0}>
								<tbody>
									<ArgumentsTable argumentsJSON={argumentsArr} />
								</tbody>
							</table>
						</div>
						:
						<div className="json-view">
							<ReactJson
								src={argumentsArr}
								iconStyle='circle'
								enableClipboard={false}
								displayDataTypes={false}
							/>
						</div>
				}

				{
					showAccountArguments && postArguments.map((element:any, index:any) => {
						return element.name === 'account' && <div key={index}>
							<AddressComponent address={element.value} key={index}/>
						</div>;
					})
				}
			</div>
		);
	} else {
		return (<div></div>);
	}

};

export default ArgumentsTableJSONView;