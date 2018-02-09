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
	 * @param {String} protocol - The protocol to use (either HTTP or HTTPS).
	 * @param {String} host - The host name of the Watchlist web service.
	 * @param {Number} port - The TCP port number of the Watchlist web service.
	 * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
	 * @extends {Disposable}
	 */
	class WatchlistGateway extends Disposable {
		constructor(protocol, host, port, requestInterceptor, description) {
			super();

			this._started = false;
			this._startPromise = null;

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			let requestInterceptorToUse;

			if (requestInterceptor) {
				requestInterceptorToUse = requestInterceptor;
			} else {
				requestInterceptorToUse = RequestInterceptor.EMPTY;
			}

			this._readServiceMetadataEndpoint = EndpointBuilder.for('read-service-metadata')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('service'))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.endpoint;

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
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance.
		 *
		 * @public
		 * @returns {Promise.<WatchlistGateway>}
		 */
		start() {
			return Promise.resolve()
			.then(() => {
				if (this._startPromise === null) {
					this._startPromise = Promise.resolve()
						.then(() => {
							this._started = true;

							return this;
						}).catch((e) => {
							this._startPromise = null;

							throw e;
						});
				}

				return this._startPromise;
			});
		}

		/**
		 * Retrieves the {@link WatchlistServiceMetadata} from the remote server.
		 *
		 * @public
		 * @returns {Promise.<WatchlistServiceMetadata>}
		 */
		readServiceMetadata() {
			return Promise.resolve()
			.then(() => {
				checkStart.call(this);

				return Gateway.invoke(this._readServiceMetadataEndpoint);
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

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the staging environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise.<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<WatchlistGateway>}
		 */
		static forDevelopment(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway('https', '54eorn43h5.execute-api.us-east-1.amazonaws.com/dev', 443, requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise.<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<WatchlistGateway>}
		 */
		static forProduction(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway('https', '54eorn43h5.execute-api.us-east-1.amazonaws.com/dev', 443, requestInterceptor));
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

	function start(gateway) {
		return gateway.start()
		.then(() => {
			return gateway;
		});
	}

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