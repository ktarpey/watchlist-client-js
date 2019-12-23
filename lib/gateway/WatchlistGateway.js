const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const uuid = require('uuid');

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
	 * @param {String} environment - A description of the environment we're connecting to.
	 * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
	 * @extends {Disposable}
	 */
	class WatchlistGateway extends Disposable {
		constructor(protocol, host, port, environment, requestInterceptor) {
			super();

			this._started = false;
			this._startPromise = null;
			this._websocket = null;
			this._clientId = uuid.v4();
			this._wsProtocol = wsProtocol;
			this._wsHost = wsHost;
			this._wsPort = wsPort;
			this._environment = environment;

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			let requestInterceptorToUse;

			if (requestInterceptor) {
				requestInterceptorToUse = requestInterceptor;
			} else {
				requestInterceptorToUse = RequestInterceptor.EMPTY;
			}

			this._wsInterceptor = function() {
				return Promise.resolve().then(() => {
					return requestInterceptorToUse.process({}).then((options) => {
						return options.headers.Authorization;
					});
				});
			};

			this._readServiceMetadataEndpoint = EndpointBuilder.for(
				'read-service-metadata',
				'check watchlist service status'
			)
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1').withLiteralParameter('service', 'service')
				)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._readWatchlistsEndpoint = EndpointBuilder.for('read-watchlists', 'read your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1').withLiteralParameter('watchlist', 'watchlist')
				)
				.withQueryBuilder((qb) => qb.withVariableParameter('context', 'context', 'context', false))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._editWatchlistEndpoint = EndpointBuilder.for('edit-watchlist', 'edit your watchlist')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb
						.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlist', 'watchlist')
						.withVariableParameter('watchlist', 'watchlist', 'watchlistId', false)
				)
				.withBodyBuilder((bb) => {
					bb.withDelegateParameter('Description', 'body', (w) => w.watchlist);
				})
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._createWatchlistEndpoint = EndpointBuilder.for('create-watchlist', 'create new watchlist')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1').withLiteralParameter('watchlist', 'watchlist')
				)
				.withBody('watchlist')
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._deleteWatchlistEndpoint = EndpointBuilder.for('delete-watchlist', 'delete your watchlist')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb
						.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlist', 'watchlist')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
				)
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._addSymbolEndpoint = EndpointBuilder.for('add-symbol', 'add new symbol')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb
						.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlist', 'watchlist')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('symbol', 'symbol')
				)
				.withBodyBuilder((bb) => {
					bb.withDelegateParameter('Description', 'body', (s) => ({ symbol: s.symbol }));
				})
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._deleteSymbolEndpoint = EndpointBuilder.for('delete-symbol', 'delete your symbol')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb
						.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlist', 'watchlist')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('symbol', 'symbol')
						.withVariableParameter('symbol', 'symbol', 'symbol', false)
				)
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._changeIndexEndpoint = EndpointBuilder.for('change-index', 'change index for your symbol')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb
						.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlist', 'watchlist')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('symbol', 'symbol')
						.withVariableParameter('symbol', 'symbol', 'symbol', false)
						.withVariableParameter('index', 'index', 'index', false)
				)
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
		}

		/**
		 * Returns a description of the environment (e.g. development or production).
		 *
		 * @public
		 * @return {*}
		 */
		get environment() {
			return this._environment;
		}

		/**
		 * Returns the websocket instance.
		 *
		 * @public
		 * @returns {*}
		 */
		get websocket() {
			return this._websocket;
		}

		/**
		 * Returns the client id.
		 *
		 * @public
		 * @returns {*}
		 */
		get clientId() {
			return this._clientId;
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance.
		 *
		 * @public
		 * @returns {Promise<WatchlistGateway>}
		 */
		start() {
			return Promise.resolve().then(() => {
				if (this._startPromise === null) {
					this._startPromise = Promise.resolve()
						.then(() => {
							this._started = true;

							return this;
						})
						.catch((e) => {
							this._startPromise = null;

							throw e;
						});
				}

				return this._startPromise;
			});
		}

		/**
		 * Initializes the callback for onmessage event
		 *
		 * @public
		 * @param {Function} callback
		 * @returns {*}
		 */
		subscribe(callback) {
			if (!this._isSubscriberExist) {
				if (window.WebSocket) {
					this._wsInterceptor().then((token) => {
						this._websocket = new WebSocket(
							this._wsProtocol + '://' + this._wsHost + ':' + this._wsPort + '/?Auth=' + token
						);
						this._websocket.onmessage = (event) => {
							const data = JSON.parse(event.data);

							callback(data);
						};
						this._isSubscriberExist = true;
					});
				}
			}
		}

		/**
		 * Retrieves the {@link WatchlistServiceMetadata} from the remote server.
		 *
		 * @public
		 * @returns {Promise<WatchlistServiceMetadata>}
		 */
		readServiceMetadata() {
			return Promise.resolve().then(() => {
				checkStart.call(this);

				return Gateway.invoke(this._readServiceMetadataEndpoint);
			});
		}

		/**
		 * Retrieves the watchlists from the remote server.
		 *
		 * @public
		 * @param {String} context
		 * @returns {Promise<Object>}
		 */
		readWatchlists(context) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(context, 'context', String);

				checkStart.call(this);

				return Gateway.invoke(this._readWatchlistsEndpoint, { context });
			});
		}

		/**
		 * Edits the watchlist in the remote server.
		 *
		 * @public
		 * @param {String} watchlistId
		 * @param {Object} watchlist
		 * @returns {Promise<Object>}
		 */
		editWatchlist(watchlistId, watchlist) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlistId, 'watchlistId', String);
				assert.argumentIsRequired(watchlist, 'watchlist', Object);

				checkStart.call(this);

				return Gateway.invoke(this._editWatchlistEndpoint, { watchlistId, watchlist });
			});
		}

		/**
		 * Creates the watchlist in the remote server.
		 *
		 * @public
		 * @param {Object} watchlist
		 * @returns {Promise<Object>}
		 */
		createWatchlist(watchlist) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlist, 'watchlist', Object);

				checkStart.call(this);

				return Gateway.invoke(this._createWatchlistEndpoint, watchlist);
			});
		}

		/**
		 * Deletes the watchlist in the remote server.
		 *
		 * @public
		 * @param {Object} watchlist
		 * @returns {Promise<Object>}
		 */
		deleteWatchlist(watchlist) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlist, 'watchlist', String);

				checkStart.call(this);

				return Gateway.invoke(this._deleteWatchlistEndpoint, { watchlist });
			});
		}

		/**
		 * Adds the symbol in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {String} symbol
		 * @returns {Promise<Object>}
		 */
		addSymbol(watchlist, symbol) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlist, 'watchlist', String);
				assert.argumentIsRequired(symbol, 'symbol', String);

				checkStart.call(this);

				return Gateway.invoke(this._addSymbolEndpoint, { watchlist, symbol });
			});
		}

		/**
		 * Deletes the symbol in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {String} symbol
		 * @returns {Promise<Object>}
		 */
		deleteSymbol(watchlist, symbol) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlist, 'watchlist', String);
				assert.argumentIsRequired(symbol, 'symbol', String);

				checkStart.call(this);

				return Gateway.invoke(this._deleteSymbolEndpoint, { watchlist, symbol });
			});
		}

		/**
		 * Changes index of symbol in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {String} symbol
		 * @param {Number} index
		 * @returns {Promise<Object>}
		 */
		changeIndex(watchlist, symbol, index) {
			return Promise.resolve().then(() => {
				assert.argumentIsRequired(watchlist, 'watchlist', String);
				assert.argumentIsRequired(symbol, 'symbol', String);
				assert.argumentIsRequired(index, 'index', Number);

				checkStart.call(this);

				return Gateway.invoke(this._changeIndexEndpoint, { watchlist, symbol, index });
			});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forDevelopment(requestInterceptor) {
			return Promise.resolve(requestInterceptor).then((requestInterceptor) => {
				assert.argumentIsOptional(
					requestInterceptor,
					'requestInterceptor',
					RequestInterceptor,
					'RequestInterceptor'
				);

				return start(
					new WatchlistGateway(
						'https',
						Configuration.developmentHost,
						443,
						'development',
						requestInterceptor,
						'ws',
						Configuration.developmentHost,
						3001
					)
				);
			});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the staging environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forStaging(requestInterceptor) {
			return Promise.resolve(requestInterceptor).then((requestInterceptor) => {
				assert.argumentIsOptional(
					requestInterceptor,
					'requestInterceptor',
					RequestInterceptor,
					'RequestInterceptor'
				);

				return start(
					new WatchlistGateway(
						'https',
						Configuration.stagingHost,
						443,
						'staging',
						requestInterceptor,
						'ws',
						Configuration.stagingHost,
						3001
					)
				);
			});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the demo environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forDemo(requestInterceptor) {
			return Promise.resolve(requestInterceptor).then((requestInterceptor) => {
				assert.argumentIsOptional(
					requestInterceptor,
					'requestInterceptor',
					RequestInterceptor,
					'RequestInterceptor'
				);

				return start(
					new WatchlistGateway(
						'https',
						Configuration.demoHost,
						443,
						'demo',
						requestInterceptor,
						'ws',
						Configuration.demoHost,
						3001
					)
				);
			});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forProduction(requestInterceptor) {
			return Promise.resolve(requestInterceptor).then((requestInterceptor) => {
				assert.argumentIsOptional(
					requestInterceptor,
					'requestInterceptor',
					RequestInterceptor,
					'RequestInterceptor'
				);

				return start(
					new WatchlistGateway(
						'https',
						Configuration.productionHost,
						443,
						'production',
						requestInterceptor,
						'ws',
						Configuration.productionHost,
						3001
					)
				);
			});
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[WatchlistGateway]';
		}
	}

	const responseInterceptorForDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		return response.data;
	});

	function start(gateway) {
		return gateway.start().then(() => {
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
