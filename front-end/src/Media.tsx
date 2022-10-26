// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
	breakpoints: {
		computer: 992,
		largeScreen: 1200,
		mobile: 320,
		tablet: 768,
		widescreen: 1920
	}
});

export const mediaStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
