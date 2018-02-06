const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-client-js/http/Gateway'),
	ProtocolType = require('@barchart/common-client-js/http/definitions/ProtocolType'),
	RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

const WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

module.exports = (() => {
	'use strict';

	/**
	 * Web service gateway for invoking the Watchlist API.
	 *
	 * @public
	 * @extends {Disposable}
	 */
	class WatchlistGateway extends Disposable {
		constructor() {
			super();

			this._started = false;
			this._startPromise = null;

			this._readUserEndpoint = null;
			this._writeUserEndpoint = null;
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the server's metadata.
		 *
		 * @public
		 * @param {String} protocol - The protocol to use (either HTTP or HTTPS).
		 * @param {String} host - The host name of the Watchlist web service.
		 * @param {Number} port - The TCP port number of the Watchlist web service.
		 * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<WatchlistServiceMetadata>}
		 */
		start(protocol, host, port, requestInterceptor) {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise === null) {
						assert.argumentIsRequired(protocol, 'protocol', String);
						assert.argumentIsRequired(host, 'host', String);
						assert.argumentIsRequired(port, 'port', Number);
						assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');
						
						const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

						let requestInterceptorToUse;

						if (requestInterceptor) {
							requestInterceptorToUse = requestInterceptor;
						} else {
							requestInterceptorToUse = RequestInterceptor.EMPTY;
						}
						
						this._startPromise = Promise.resolve()
							.then(() => {
								const readServiceMetadataEndpoint = EndpointBuilder.for('read-service-metadata')
									.withVerb(VerbType.GET)
									.withProtocol(protocolType)
									.withHost(host)
									.withPort(port)
									.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('service'))
									.withRequestInterceptor(requestInterceptorToUse)
									.withResponseInterceptor(ResponseInterceptor.DATA)
									.endpoint;

								return Gateway.invoke(readServiceMetadataEndpoint)
									.then((metadata) => {
										this._readUserEndpoint = EndpointBuilder.for('read-user')
											.withVerb(VerbType.GET)
											.withProtocol(protocolType)
											.withHost(host)
											.withPort(port)
											.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('user'))
											.withRequestInterceptor(requestInterceptorToUse)
											.withResponseInterceptor(responseInterceptorForDeserialization)
											.endpoint;

										this._writeUserEndpoint = EndpointBuilder.for('write-user')
											.withVerb(VerbType.PUT)
											.withProtocol(protocolType)
											.withHost(host)
											.withPort(port)
											.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('user'))
											.withEntireBody()
											.withRequestInterceptor(requestInterceptorToUse)
											.withRequestInterceptor(requestInterceptorForSerialization)
											.endpoint;

										this._started = true;

										return metadata;
									}).catch((e) => {
										this._started = false;
										this._startPromise = null;

										return null;
									});
							});
					}

					return this._startPromise;
				});
		}

		/**
		 * Retrieves the {@link WatchlistUser} from the remote server.
		 *
		 * @public
		 * @returns {Promise.<WatchlistUser>}
		 */
		readUser() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._readUserEndpoint);
				});
		}

		/**
		 * Instructs the remote server to save the {@link WatchlistUser}.
		 *
		 * @public
		 * @param {WatchlistUser} watchlistUser
		 * @returns {Promise.<WatchlistUser>}
		 */
		writeUser(watchlistUser) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlistUser, 'watchlistUser', WatchlistUser, 'WatchlistUser');

					checkStart.call(this);

					return Gateway.invoke(this._writeUserEndpoint, watchlistUser);
				});
		}

		_onDispose() {
			return;
		}
		
		toString() {
			return `[WatchlistGateway]`;
		}
	}

	const requestInterceptorForSerialization = RequestInterceptor.fromDelegate((request) => {
		assert.argumentIsRequired(request.data, 'request.data', WatchlistUser, 'WatchlistUser');

		request.data = request.data.toJSObj();

		return request;
	});

	const responseInterceptorForDeserialization = ResponseInterceptor.fromDelegate((response) => {
		return WatchlistUser.parse(response.data);
	});

	function checkStart() {
		if (this.getIsDisposed()) {
			throw new Error('Unable to use gateway, the gateway has been disposed.');
		}

		if (!this._started) {
			throw new Error('Unable to use gateway, the gateway has not started.');
		}
	}

	/**
	 * Watchlist server metadata.
	 *
	 * @public
	 * @typedef WatchlistServiceMetadata
	 * @type {Object}
	 * @property {String} service.semver - The server version.
	 * @property {String} user.id - The current user's identifier.
	 * @property {String} user.permissions - The current user's permission level.
	 */

 	return WatchlistGateway;
})();