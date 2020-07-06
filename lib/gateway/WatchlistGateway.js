const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	promise = require('@barchart/common-js/lang/promise');

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

	const REST_API_SECURE_PROTOCOL = 'https';
	const REST_API_SECURE_PORT = 443;

	const WEBSOCKET_SECURE_PROTOCOL = 'wss';
	
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
		constructor(protocol, host, port, environment, requestInterceptor, wsProtocol, wsHost, wsPort) {
			super();

			this._clientId = uuid.v4();

			this._isSubscriberExist = false;
			this._wsProtocol = wsProtocol;
			this._wsHost = wsHost;
			this._environment = environment;

			this._websocket = null;

			this._started = false;
			this._startPromise = null;

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			let requestInterceptorToUse;

			if (requestInterceptor) {
				requestInterceptorToUse = requestInterceptor;
			} else {
				requestInterceptorToUse = RequestInterceptor.EMPTY;
			}

			this._wsInterceptor = function() {
				return Promise.resolve()
					.then(() => {
						return requestInterceptorToUse.process({})
							.then((options) => {
								return options.headers.Authorization;
							});
					});
			};

			this._metadataReadEndpoint = EndpointBuilder.for('read-service-metadata', 'check version of watchlist service')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('service', 'service')
				)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._watchlistReadEndpoint = EndpointBuilder.for('read-watchlists', 'read your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
				)
				.withQueryBuilder((qb) => qb.withVariableParameter('context', 'context', 'context', false))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._watchlistCreateEndpoint = EndpointBuilder.for('create-watchlist', 'create new watchlist')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
				)
				.withBody('watchlist')
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
			
			this._watchlistEditEndpoint = EndpointBuilder.for('edit-watchlist', 'edit your watchlist')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
						.withVariableParameter('watchlist', 'watchlist', 'watchlistId', false)
				)
				.withBodyBuilder((bb) => {
					bb.withDelegateParameter('Description', 'body', (b) => b.watchlist);
				})
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
			
			this._watchlistDeleteEndpoint = EndpointBuilder.for('delete-watchlist', 'delete your watchlist')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
				)
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._symbolAddEndpoint = EndpointBuilder.for('add-symbol', 'add new symbol')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('symbols', 'symbols')
				)
				.withBodyBuilder((bb) => {
					bb.withDelegateParameter('Description', 'body', (b) => ({ symbol: b.symbol }));
				})
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._symbolDeleteEndpoint = EndpointBuilder.for('delete-symbol', 'delete your symbol')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('symbols', 'symbols')
						.withVariableParameter('symbol', 'symbol', 'symbol', false)
				)
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;

			this._preferencesEditEndpoint = EndpointBuilder.for('edit-preferences', 'edit preferences')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
						.withVariableParameter('watchlist', 'watchlist', 'watchlist', false)
						.withLiteralParameter('preferences', 'preferences')
				)
				.withBodyBuilder((bb) => {
					bb.withDelegateParameter('Description', 'body', (b) => b.preferences);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL).endpoint;
		}

		/**
		 * Returns a description of the environment (e.g. development or production).
		 *
		 * @public
		 * @return {String}
		 */
		get environment() {
			return this._environment;
		}

		/**
		 * A unique identifier for the instance.
		 *
		 * @public
		 * @returns {String}
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
		 * Connect to the websocket with reconnection
		 *
		 * @public
		 * @param {String} token
		 * @param {Function} resolve
		 * @param {Function} refreshCallback - a callback function to refresh application state.
		 */
		connectWebsocket(token, resolve, refreshCallback) {
			let callback = null;

			if (this._websocket !== null && this._websocket.onmessage !== null) {
				callback = this._websocket.onmessage;
			}

			this._websocket = new WebSocket(`${this._wsProtocol}://${this._wsHost}/?Auth=${token}`);

			if (callback !== null) {
				this._websocket.onmessage = callback;
			}

			this._websocket.onopen = () => {
				if (typeof refreshCallback === 'function' ) {
					refreshCallback();
				}

				resolve(true);
			};

			this._websocket.onclose = () => {
				setTimeout(this.connectWebsocket.bind(this, token, resolve, refreshCallback), 1000);
			};
		}

		/**
		 * Initialize websocket connection
		 *
		 * @public
		 * @param {String} token
		 * @param {Function} refreshCallback
		 * @returns {Promise}
		 */
		setupWebsocket(token, refreshCallback) {
			return promise.build((resolve, reject) => {
				this.connectWebsocket(token, resolve, refreshCallback);
			});
		}

		/**
		 * Initializes the callback for onmessage event
		 *
		 * @public
		 * @param {Function} callback - on message callback function
		 * @param {Function} refreshCallback - a callback function to refresh application state
		 * @returns {*}
		 */
		subscribe(callback, refreshCallback) {
			return Promise.resolve()
				.then(() => {
					if (!this._isSubscriberExist && window.WebSocket) {
						return this._wsInterceptor()
							.then((token) => {
								return this.setupWebsocket(token, refreshCallback)
									.then(() => {
										this._websocket.onmessage = (event) => {
											const data = JSON.parse(event.data);

											if (data.action) {
												if (data.action === 'PING') {
													const responseMessage = {
														action: 'PONG',
														response: ''
													};

													this._websocket.send(JSON.stringify(responseMessage));
												}
											}

											if (data.clientId !== this._clientId) {
												callback(data);
											}
										};

										this._isSubscriberExist = true;
									});
							});
					}
				});
		}

		/**
		 * Retrieves the {@link WatchlistServiceMetadata} from the remote server.
		 *
		 * @public
		 * @returns {Promise<WatchlistServiceMetadata>}
		 */
		readServiceMetadata() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._metadataReadEndpoint);
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(context, 'context', String);

					checkStart.call(this);

					return Gateway.invoke(this._watchlistReadEndpoint, { context });
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlistId, 'watchlistId', String);
					assert.argumentIsRequired(watchlist, 'watchlist', Object);

					checkStart.call(this);

					return Gateway.invoke(this._watchlistEditEndpoint, { watchlistId, watchlist });
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', Object);

					checkStart.call(this);

					return Gateway.invoke(this._watchlistCreateEndpoint, watchlist);
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);

					checkStart.call(this);

					return Gateway.invoke(this._watchlistDeleteEndpoint, { watchlist });
				});
		}

		/**
		 * Adds the symbol in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {Object} symbol
		 * @returns {Promise<Object>}
		 */
		addSymbol(watchlist, symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);
					assert.argumentIsRequired(symbol, 'symbol', Object);

					checkStart.call(this);

					return Gateway.invoke(this._symbolAddEndpoint, { watchlist, symbol });
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);
					assert.argumentIsRequired(symbol, 'symbol', String);

					checkStart.call(this);

					return Gateway.invoke(this._symbolDeleteEndpoint, { watchlist, symbol });
				});
		}

		/**
		 * Edit watchlist preferences in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {Object} preferences
		 * @returns {Promise<Object>}
		 */
		editPreferences(watchlist, preferences) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);
					assert.argumentIsRequired(preferences, 'preferences', Object);

					checkStart.call(this);

					return Gateway.invoke(this._preferencesEditEndpoint, { watchlist, preferences });
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
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.developmentHost, REST_API_SECURE_PORT, 'development', requestInterceptor, WEBSOCKET_SECURE_PROTOCOL, Configuration.developmentHostForWebSocket));
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
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.stagingHost, REST_API_SECURE_PORT, 'staging', requestInterceptor, WEBSOCKET_SECURE_PROTOCOL, Configuration.stagingHostForWebSocket));
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
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.demoHost, REST_API_SECURE_PORT, 'demo', requestInterceptor, WEBSOCKET_SECURE_PROTOCOL, Configuration.demoHost));
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
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.productionHost, REST_API_SECURE_PORT, 'production', requestInterceptor, WEBSOCKET_SECURE_PROTOCOL, Configuration.productionHostForWebSocket));
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
	 * @property {String} server.semver - The server version.
	 * @property {String} user.id - The current user's identifier.
	 * @property {String} user.permissions - The current user's permission level.
	 */

	return WatchlistGateway;
})();
