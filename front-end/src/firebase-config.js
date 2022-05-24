// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { FIREBASE_API_KEY } from 'src/global/apiKeys';

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	appId: '1:908283772093:web:8e8b80b975cf793295cbd4',
	authDomain: 'polkassembly-home.firebaseapp.com',
	measurementId: 'G-YX7MKKDLL9',
	messagingSenderId: '908283772093',
	projectId: 'polkassembly-home',
	storageBucket: 'polkassembly-home.appspot.com'
};

// Initialize Firebase
const firebaseApp  = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);