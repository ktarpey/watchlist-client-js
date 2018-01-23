const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Serializer = require('@barchart/common-js/timing/Serializer');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

const WatchlistGatewayConfiguration = require('./WatchlistGatewayConfiguration');

module.exports = (() => {
	'use strict';

	/**
	 * Web service gateway for invoking the Watchlist API.
	 *
	 * @public
	 */
	class WatchlistGateway {
		constructor() {
			this._startPromise = null;
			this._started = false;

			this._readEndpoint = null;
			this._writeEndpoint = null;

			this._serializer = new Serializer();
		}

		start(configuration, requestInterceptor, responseInterceptor) {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise !== null) {
						return this._startPromise;
					}

					assert.argumentIsRequired(configuration, 'configuration', WatchlistGatewayConfiguration, 'WatchlistGatewayConfiguration');

					this._startPromise = Promise.resolve()
						.then(() => {
							this._readEndpoint = null;
							this._writeEndpoint = null;

							return this._started = true;
						});
				});
		}

		readUser() {
			return Promise.resolve()
				.then(() => {
					if (!this._started) {
						throw new Error('Unable to write watchlist user, the gateway has not started.');
					}
				});
		}

		writeUser(watchlistUser) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlistUser, 'watchlistUser', WatchlistUser, 'WatchlistUser');

					if (!this._started) {
						throw new Error('Unable to write watchlist user, the gateway has not started.');
					}
				});
		}

		toString() {
			return `[WatchlistGateway]`;
		}
	}

	return WatchlistGateway;
})();