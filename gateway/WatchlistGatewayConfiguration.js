const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Configuration data for a {@link WatchlistGateway}.
	 *
	 * @public
	 */
	class WatchlistGatewayConfiguration {
		constructor(protocol, host, port, requestInterceptorForRead) {
			this._protocol = protocol;
			this._host = host;
			this._port = port;

			this._requestInterceptorForRead = requestInterceptorForRead || null;
		}

		get protocol() {
			return this._protocol;
		}

		get host() {
			return this._host;
		}

		get port() {
			return this._port;
		}

		get requestInterceptorForRead() {
			return this._requestInterceptorForRead;
		}

		toString() {
			return `[WatchlistGatewayConfiguration]`;
		}
	}

	return WatchlistGatewayConfiguration;
})();