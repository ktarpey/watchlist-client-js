const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

const Configuration = require('./../common/Configuration');

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
		constructor(protocol, host, port, requestInterceptor) {
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

			this._readServiceMetadataEndpoint = EndpointBuilder.for('read-service-metadata', 'check watchlist service status')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => pb.withLiteralParameter('version', 'v1').withLiteralParameter('service', 'service'))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readUserEndpoint = EndpointBuilder.for('read-user', 'read your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => pb.withLiteralParameter('version', 'v1').withLiteralParameter('user', 'user'))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._writeUserEndpoint = EndpointBuilder.for('write-user', 'save your watchlists')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => pb.withLiteralParameter('version', 'v1').withLiteralParameter('user', 'user'))
				.withBody('watchlist data')
				.withRequestInterceptor(requestInterceptorToUse)
				.withRequestInterceptor(requestInterceptorForSerialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
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
		 * Creates and starts a new {@link WatchlistGateway} for use in the development environment.
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

					return start(new WatchlistGateway('https', Configuration.developmentHost, 443, requestInterceptor));
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

					return start(new WatchlistGateway('https', Configuration.productionHost, 443, requestInterceptor));
				});
		}

		_onDispose() {
			return;
		}
		
		toString() {
			return '[WatchlistGateway]';
		}
	}

	const requestInterceptorForSerialization = RequestInterceptor.fromDelegate((request, ignored) => {
		assert.argumentIsRequired(request.data, 'request.data', WatchlistUser, 'WatchlistUser');

		request.data = request.data.toJSObj();

		return request;
	});

	const responseInterceptorForDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
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