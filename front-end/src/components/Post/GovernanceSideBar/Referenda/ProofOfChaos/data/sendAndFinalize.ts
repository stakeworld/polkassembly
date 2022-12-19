// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const SendAndFinalize = async (
	api: any,
	tx : any,
	signer: any,
	address: any
) => {
	const promiseFunction = async (resolve: any, reject: any) => {
		if( !api ){
			return;
		}
		try {
			console.log('in try of send and finalize');
			const unsub = await tx.signAndSend(
				address, { signer: signer }, ({ status, dispatchError }: any) => {
					if (status.isInBlock) {
						// console.log( 'transaction in block waiting for finalization' )
					} else if (status.isFinalized) {
						// console.log(`Transaction included at blockHash ${status.asFinalized}`);
						// console.log(`Transaction hash ${txHash.toHex()}`);

						// Loop through Vec<EventRecord> to display all events
						if (dispatchError) {
							if (dispatchError.isModule) {
								// for module errors, we have the section indexed, lookup
								const decoded = api.registry.findMetaError(dispatchError.asModule);
								const { docs } = decoded;

								reject(docs.join(' '));
							} else {
								// Other, CannotLookup, BadOrigin, no extra info
								reject(dispatchError.toString());
							}
						} else {
							//store the user quiz answers locally
							// onSuccess()
							resolve(`success signAndSend ${ tx.name }` );
						}
						unsub();
					}
				});
		} catch (err) {
			reject('signAndSend cancelled');
		}
	};
	return new Promise((resolve, reject) => promiseFunction(resolve, reject));
};