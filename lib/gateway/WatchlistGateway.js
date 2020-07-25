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

	const WEBSOCKET_STATE_IDLE = 'IDLE';
	const WEBSOCKET_STATE_DISCONNECTED = 'DISCONNECTED';
	const WEBSOCKET_STATE_CONNECTING = 'CONNECTING';
	const WEBSOCKET_STATE_CONNECTED = 'CONNECTED';

	const WEBSOCKET_RECONNECT_DELAY = 5000;

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
		constructor(protocol, host, port, environment, requestInterceptor, webSocketProtocol, webSocketHost) {
			super();

			this._clientId = uuid.v4();
			this._environment = environment;

			this._webSocketProtocol = webSocketProtocol || null;
			this._webSocketHost = webSocketHost || null;

			this._webSocket = null;
			this._webSocketStatus = WEBSOCKET_STATE_IDLE;
			
			this._started = false;
			this._startPromise = null;

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			let requestInterceptorToUse;

			if (requestInterceptor) {
				requestInterceptorToUse = requestInterceptor;
			} else {
				requestInterceptorToUse = RequestInterceptor.EMPTY;
			}

			this._tokenGenerator = () => {
				return requestInterceptorToUse.process({})
					.then((options) => {
						return options.headers.Authorization;
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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._watchlistReadEndpoint = EndpointBuilder.for('read-watchlists', 'read your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
				)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
					bb.withDelegateParameter('Description', 'body', (b) => ({ entry: b.entry }));
				})
				.withHeadersBuilder((hb) => {
					hb.withLiteralParameter('X-Barchart-Client-ID', 'X-Barchart-Client-ID', this._clientId);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._symbolQueryEndpoint = EndpointBuilder.for('query-watchlists-for-symbol', 'query your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('symbols', 'symbols')
						.withVariableParameter('symbol', 'symbol', 'symbol', false)
				)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

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
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;
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
		 * Subscribes to remote changes to watchlists (requires native WebSocket support).
		 *
		 * @public
		 * @param {Callbacks.WebSocketMessageCallback} messageCallback
		 * @param {Callbacks.WebSocketStatusCallback} statusCallback
		 * @returns {Promise}
		 */
		subscribe(messageCallback, statusCallback) {
			return Promise.resolve()
				.then(() => {
					if (!window.WebSocket) {
						return Promise.reject('Unable to subscribe to watchlist. WebSockets are not supported.');
					}

					if (!(this._webSocketStatus === WEBSOCKET_STATE_IDLE)) {
						return Promise.reject('Unable to subscribe to watchlist. Subscription already exists.');
					}

					this._webSocketStatus = WEBSOCKET_STATE_DISCONNECTED;

					assert.argumentIsRequired(messageCallback, 'messageCallback', Function);
					assert.argumentIsRequired(statusCallback, 'statusCallback', Function);

					const changeStatus = (status) => {
						try {
							statusCallback(this._webSocketStatus = status);
						} catch (e) {
							console.error('WebSocket status callback for watchlist threw an error', e);
						}
					};

					const connect = () => {
						return promise.build((resolveCallback) => {
							changeStatus(WEBSOCKET_STATE_CONNECTING);

							return this._tokenGenerator()
								.then((token) => {
									this._webSocket = new WebSocket(`${this._webSocketProtocol}://${this._webSocketHost}/?Auth=${token}`);

									this._webSocket.onopen = () => {
										changeStatus(WEBSOCKET_STATE_CONNECTED);

										resolveCallback();
									};

									this._webSocket.onclose = () => {
										changeStatus(WEBSOCKET_STATE_DISCONNECTED);

										setTimeout(connect, WEBSOCKET_RECONNECT_DELAY);
									};

									this._webSocket.onmessage = (event) => {
										const data = JSON.parse(event.data);

										let publish = true;

										if (data.action === 'PING') {
											publish = false;

											this._webSocket.send(JSON.stringify({ action: 'PONG', response: '' }));
										}

										if (publish && data.clientId !== this._clientId) {
											messageCallback(data);
										}
									};
								});
						});
					};

					return connect();
				});
		}

		/**
		 * Retrieves the {@link Schema.WatchlistServiceMetadata} from the remote server.
		 *
		 * @public
		 * @returns {Promise<Schema.WatchlistServiceMetadata>}
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
		 * @returns {Promise<Object>}
		 */
		readWatchlists() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._watchlistReadEndpoint);
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

					const payload = { };

					payload.watchlistId = watchlistId;
					payload.watchlist = watchlist;

					return Gateway.invoke(this._watchlistEditEndpoint, payload);
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
		 * @param {String} watchlist
		 * @returns {Promise<Object>}
		 */
		deleteWatchlist(watchlist) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = watchlist;

					return Gateway.invoke(this._watchlistDeleteEndpoint, payload);
				});
		}

		/**
		 * Adds the symbol in the remote server.
		 *
		 * @public
		 * @param {String} watchlist
		 * @param {Object} entry
		 * @returns {Promise<Object>}
		 */
		addSymbol(watchlist, entry) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', String);
					assert.argumentIsRequired(entry, 'entry', Object);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = watchlist;
					payload.entry = entry;

					return Gateway.invoke(this._symbolAddEndpoint, payload);
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

					const payload = { };

					payload.watchlist = watchlist;
					payload.symbol = symbol;

					return Gateway.invoke(this._symbolDeleteEndpoint, payload);
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

					const payload = { };

					payload.watchlist = watchlist;
					payload.preferences = preferences;

					return Gateway.invoke(this._preferencesEditEndpoint, payload);
				});
		}

		/**
		 * Returns the list of watchlists names and a flag indicating whether the specified
		 * symbol is included in each watchlist.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Promise}
		 */
		querySymbol(symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(symbol, 'symbol', String);

					checkStart.call(this);

					return Gateway.invoke(this._symbolQueryEndpoint, { symbol });
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
		 * Creates and starts a new {@link WatchlistGateway} for use in the test environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forTest(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.testHost, REST_API_SECURE_PORT, 'development', requestInterceptor, WEBSOCKET_SECURE_PROTOCOL, Configuration.testHostForWebSocket));
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

	return WatchlistGateway;
})();
