const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const ProtocolType = require('@barchart/common-client-js/http/definitions/ProtocolType'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

module.exports = (() => {
	'use strict';

	/**
	 * Instructions for accessing the remote Watchlist API.
	 *
	 * @public
	 * @param {String} protocol
	 * @param {String} host
	 * @param {Number} port
	 */
	class WatchlistServiceAddress {
		constructor(protocol, host, port) {
			assert.argumentIsRequired(protocol, 'protocol', String);
			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);

			assert.argumentIsValid(protocol, 'protocol', p => Enum.fromCode(ProtocolType, p.toUpperCase()) !== null, 'The "protocol" is unsupported.');
			assert.argumentIsValid(host, 'host', h => h.length !== 0, 'The "host" cannot be a zero-length string.');
			assert.argumentIsValid(port, 'port', p => is.integer(p) && !(p < 0 || p > 65535), 'The "port" is invalid.');

			this._protocol = Enum.fromCode(ProtocolType, protocol.toUpperCase());
			this._host = host;
			this._port = port;
		}

		/**
		 * The {@link ProtocolType}.
		 *
		 * @public
		 * @returns {ProtocolType}
		 */
		get protocol() {
			return this._protocol;
		}

		/**
		 * The remote host.
		 *
		 * @public
		 * @returns {String}
		 */
		get host() {
			return this._host;
		}

		/**
		 * The TCP port.
		 *
		 * @public
		 * @returns {Number}
		 */
		get port() {
			return this._port;
		}

		/**
		 * The address of the development environment.
		 * 
		 * @public
		 * @static
		 * @returns {WatchlistServiceAddress}
		 * @constructor
		 */
		static get DEVELOPMENT() {
			return development;
		}

		toString() {
			return `[WatchlistServiceAddress]`;
		}
	}

	const development = new WatchlistServiceAddress('https', '54eorn43h5.execute-api.us-east-1.amazonaws.com/dev', 443);

	return WatchlistServiceAddress;
})();