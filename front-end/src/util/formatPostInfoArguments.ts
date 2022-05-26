// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function (rawArguments: any): any[] {
	const argumentsArr: any[] = [];
	rawArguments?.forEach((obj: any) => {
		const argumentsObj: any = {};
		delete obj.__typename;
		argumentsObj['name'] = obj.name;
		try {
			argumentsObj['value'] = JSON.parse(obj.value);
		} catch {
			argumentsObj['value'] = obj.value;
		}
		argumentsArr.push(argumentsObj);
	});

	return argumentsArr;
}
