/**
 * Reports the current page to the server so it can be added to the user journey.
 *
 * This only loads for logged out visitors, and only exists because PHP is not always able to
 * track the page itself. The server skips the page when it was already tracked.
 *
 * @see FrmUsrTrkFallbackController
 */
( function() {
	'use strict';

	const settings = window.frmUsrTrkFallback;
	if ( ! settings || ! settings.ajaxUrl ) {
		return;
	}

	// The hash is never sent to the server, so leave it out to match the URL PHP tracks.
	const url = window.location.origin + window.location.pathname + window.location.search;

	const formData = new FormData();
	formData.append( 'action', settings.action );
	formData.append( 'url', url );
	formData.append( 'referer', document.referrer );
	formData.append( 'title', document.title );

	fetch( settings.ajaxUrl, {
		method: 'POST',
		body: formData,
		// The session cookie is what ties the page to the visitor.
		credentials: 'same-origin',
		// Let the request finish when the visitor leaves the page right away.
		keepalive: true,
	} ).catch( () => {
		// Tracking a page is a best effort, so there is nothing to do when the request fails.
	} );
}() );
