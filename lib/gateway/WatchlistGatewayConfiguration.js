const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const ProtocolType = require('@barchart/common-client-js/http/definitions/ProtocolType'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

const RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor');

module.exports = (() => {
	'use strict';

	/**
	 * Configuration data for a {@link WatchlistGateway}.
	 *
	 * @public
	 * @param {String} host
	 * @param {String} protocol
	 * @param {Number} port
	 * @param {Function} jwtProvider
	 */
	class WatchlistGatewayConfiguration {
		constructor(host, protocol, port, jwtProvider) {
			this._host = host;

			this._protocol = Enum.fromCode(ProtocolType, protocol) || ProtocolType.HTTPS;
			this._port = port || this._protocol.defaultPort;

			this._requestInterceptorForJwt = RequestInterceptor.fromDelegate((request) => {
				return Promise.resolve()
					.then(() => {
						return jwtProvider();
					}).then((token) => {
						request.headers = request.headers || { };
						request.headers.Authorization = `Bearer ${token}`;

						return request;
					});
			});
		}

		/**
		 * The {@link ProtocolType} to use for outgoing requests.
		 *
		 * @public
		 * @returns {ProtocolType}
		 */
		get protocol() {
			return this._protocol;
		}

		/**
		 * The remote host to use for outgoing requests.
		 *
		 * @public
		 * @returns {String}
		 */
		get host() {
			return this._host;
		}

		/**
		 * The TCP port to use for outgoing requests.
		 *
		 * @public
		 * @returns {String}
		 */
		get port() {
			return this._port;
		}

		/**
		 * A {@link RequestInterceptor} that adds a JWT token to outgoing requests.
		 *
		 * @public
		 * @returns {RequestInterceptor}
		 */
		get requestInterceptorForJwt() {
			return this._requestInterceptorForJwt;
		}

		static get DEFAULT() {
			return defaultConfiguration;
		}

		toString() {
			return `[WatchlistGatewayConfiguration]`;
		}
	}

	const defaultConfiguration = new WatchlistGatewayConfiguration('54eorn43h5.execute-api.us-east-1.amazonaws.com/dev', 'https');

	return WatchlistGatewayConfiguration;
})();