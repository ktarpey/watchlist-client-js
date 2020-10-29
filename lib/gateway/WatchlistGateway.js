const uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const Configuration = require('./../common/Configuration'),
	JwtProvider = require('../security/JwtProvider');

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
	 * The **central component of the SDK**. It is responsible for connecting to Barchart's
	 * Watchlist Service. It can be used to query, edit, and delete watchlists.
	 *
	 * @public
	 * @exported
	 * @param {String} protocol - The protocol of the of the Watchlist web service (either http or https).
	 * @param {String} host - The hostname of the Watchlist web service.
	 * @param {Number} port - The TCP port number of the Watchlist web service.
	 * @param {String} environment - A description of the environment we're connecting to.
	 * @param {String=} webSocketProtocol - The protocol of the Watchlist subscription service (either ws or wss).
	 * @param {String=} webSocketHost - The hostname of the Watchlist subscription service.
	 * @extends {Disposable}
	 */
	class WatchlistGateway extends Disposable {
		constructor(protocol, host, port, environment, webSocketProtocol, webSocketHost) {
			super();

			this._clientId = uuid.v4();
			this._environment = environment;

			this._webSocketProtocol = webSocketProtocol || null;
			this._webSocketHost = webSocketHost || null;

			this._webSocket = null;
			this._webSocketStatus = WEBSOCKET_STATE_IDLE;

			this._jwtProvider = null;

			this._started = false;
			this._startPromise = null;

			this._authorizationEvent = new Event(this);

			const requestInterceptor = RequestInterceptor.fromDelegate((options, endpoint) => {
				return Promise.resolve()
					.then(() => {
						return this._jwtProvider.getToken()
							.then((token) => {
								options.headers = options.headers || {};
								options.headers.Authorization = `Bearer ${token}`;

								return options;
							});
					}).catch((e) => {
						const failure = FailureReason.forRequest({ endpoint: endpoint })
							.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
							.format();

						return Promise.reject(failure);
					});
			});

			const errorInterceptor = ErrorInterceptor.fromDelegate((error, endpoint) => {
				return ErrorInterceptor.GENERAL.process(error, endpoint)
					.catch((e) => {
						try {
							if (is.array(e)) {
								const item = e.find(i => i.value && i.value.code === 'ENTITLEMENTS_FAILED') || null;

								if (item !== null && item.value && item.value.data) {
									this._authorizationEvent.fire(item.value.data);
								}
							}
						} catch (ignored) {

						}

						return Promise.reject(e);
					});
			});

			const responseInterceptor = ResponseInterceptor.fromDelegate((response, ignored) => {
				const data = response.data;

				try {
					if (is.object(data) && data.hasOwnProperty('authorization')) {
						const authorization = data.authorization;

						this._authorizationEvent.fire(authorization);

						delete data.authorization;
					}
				} catch (error) {

				}

				return data;
			});

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			this._watchlistReadEndpoint = EndpointBuilder.for('read-watchlists', 'read your watchlists')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('watchlists', 'watchlists')
				)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
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
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
				.endpoint;

			this._metadataReadEndpoint = EndpointBuilder.for('read-service-metadata', 'check version of watchlist service')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v1')
						.withLiteralParameter('service', 'service')
				)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptor)
				.withErrorInterceptor(errorInterceptor)
				.endpoint;
		}

		/**
		 * A description of the environment (e.g. development, production, etc).
		 *
		 * @public
		 * @return {String}
		 */
		get environment() {
			return this._environment;
		}

		/**
		 * Attempts to establish a connection to the backend. This function should be invoked
		 * immediately following instantiation. Once the resulting promise resolves, a
		 * connection has been established and other instance methods can be used.
		 *
		 * @public
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					if (this._startPromise === null) {
						this._startPromise = Promise.resolve()
							.then(() => {
								this._started = true;

								this._jwtProvider = jwtProvider;

								return this;
							}).catch((e) => {
								this._started = false;
								this._startPromise = null;

								this._jwtProvider = null;

								throw e;
							});
					}

					return this._startPromise;
				});
		}

		/**
		 * Retrieves all watchlists for the current user.
		 *
		 * @public
		 * @returns {Promise<Schema.Watchlist[]>}
		 */
		readWatchlists() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._watchlistReadEndpoint);
				});
		}

		/**
		 * Subscribes watchlists. Only one subscription is supported. Invoking this
		 * function more than once will fail. At present, a subscription requires native
		 * WebSocket support (in a browser). This will be enhanced to work in Node.js
		 * environments soon.
		 *
		 * @public
		 * @param {Callbacks.SubscriptionMessageCallback} messageCallback - Invoked when a watchlist is added, changed, or removed.
		 * @param {Callbacks.SubscriptionStatusCallback} statusCallback - Invoked when the state of the subscription changes.
		 * @param {Boolean=} echo - If true, changes made by this instance will cause the ```messageCallback``` to be invoked.
		 * @returns {Promise}
		 */
		subscribeWatchlists(messageCallback, statusCallback, echo) {
			return Promise.resolve()
				.then(() => {
					if (!window.WebSocket) {
						return Promise.reject('Unable to subscribe to watchlist. WebSockets are not supported.');
					}

					if (!(this._webSocketStatus === WEBSOCKET_STATE_IDLE)) {
						return Promise.reject('Unable to subscribe to watchlist. Subscription already exists.');
					}

					checkStart.call(this);

					assert.argumentIsRequired(messageCallback, 'messageCallback', Function);
					assert.argumentIsRequired(statusCallback, 'statusCallback', Function);

					this._webSocketStatus = WEBSOCKET_STATE_DISCONNECTED;

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

							return this._jwtProvider.getToken()
								.then((token) => {
									this._webSocket = new WebSocket(`${this._webSocketProtocol}://${this._webSocketHost}/v1/?token=${token}`);

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

										if (publish && data.clientId !== this._clientId || (is.boolean(echo) && echo)) {
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
		 * Saves a new watchlist.
		 *
		 * @public
		 * @param {Schema.Watchlist} watchlist - The watchlist to save.
		 * @returns {Promise<Schema.Watchlist>}
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
		 * Saves an existing watchlist.
		 *
		 * @public
		 * @param {Schema.Watchlist} watchlist - The watchlist to save.
		 * @returns {Promise<Schema.Watchlist>}
		 */
		editWatchlist(watchlist) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlist, 'watchlist', Object);
					assert.argumentIsRequired(watchlist.id, 'watchlist.id', String);

					checkStart.call(this);

					const payload = { };

					payload.watchlistId = watchlist.id;
					payload.watchlist = watchlist;

					return Gateway.invoke(this._watchlistEditEndpoint, payload);
				});
		}

		/**
		 * Deletes an existing watchlist.
		 *
		 * @public
		 * @param {String} id - The identifier of the watchlist to delete.
		 * @returns {Promise<Object>}
		 */
		deleteWatchlist(id) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(id, 'id', String);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = id;

					return Gateway.invoke(this._watchlistDeleteEndpoint, payload);
				});
		}

		/**
		 * Saves an existing watchlist - overwriting its ```preferences``` property.
		 *
		 * @public
		 * @param {String} id - The identifier of the watchlist to edit.
		 * @param {Schema.WatchlistPreferences} preferences - The preferences object to save.
		 * @returns {Promise<Schema.Watchlist>}
		 */
		editPreferences(id, preferences) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(id, 'id', String);
					assert.argumentIsRequired(preferences, 'preferences', Object);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = id;
					payload.preferences = preferences;

					return Gateway.invoke(this._preferencesEditEndpoint, payload);
				});
		}

		/**
		 * Adds a new entry (i.e. symbol) to an existing watchlist.
		 *
		 * @public
		 * @param {String} id - The identifier of the watchlist to edit.
		 * @param {Schema.WatchlistEntry} entry - The entry to add.
		 * @param {Number=} index - The index to insert the entry (if absent, the entry will be placed at the end of the list).
		 * @returns {Promise<Schema.Watchlist>}
		 */
		addSymbol(id, entry, index) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(id, 'id', String);
					assert.argumentIsRequired(entry, 'entry', Object);
					assert.argumentIsOptional(index, 'index', Number);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = id;
					payload.entry = entry;

					if (is.number(index)) {
						payload.index = index;
					}

					return Gateway.invoke(this._symbolAddEndpoint, payload);
				});
		}

		/**
		 * Deletes an existing entry (i.e. symbol) from an existing watchlist.
		 *
		 * @public
		 * @param {String} id - The identifier of the watchlist to edit.
		 * @param {String} symbol - The symbol to remove.
		 * @returns {Promise<Schema.Watchlist>}
		 */
		deleteSymbol(id, symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(id, 'id', String);
					assert.argumentIsRequired(symbol, 'symbol', String);

					checkStart.call(this);

					const payload = { };

					payload.watchlist = id;
					payload.symbol = symbol;

					return Gateway.invoke(this._symbolDeleteEndpoint, payload);
				});
		}

		/**
		 * Queries existing watchlists for a specific symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @returns {Promise<Schema.WatchlistSymbolQueryResult[]>}
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
		 * Retrieves information regarding the remote service (e.g. version number, current user identifier, etc).
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
		 * Registers a callback which will be notified when an authorization event occurs.
		 *
		 * @public
		 * @param {Function} authorizationObserver
		 * @returns {Disposable}
		 */
		registerAuthorizationObserver(authorizationObserver) {
			assert.argumentIsRequired(authorizationObserver, 'authorizationObserver', Function);

			if (this.getIsDisposed()) {
				throw new Error('Unable to use gateway, the gateway has been disposed.');
			}

			const wrappedAuthorizationObserver = (result) => {
				try {
					authorizationObserver(result.request, result.response);
				} catch (e) {

				}
			};

			return this._authorizationEvent.register(wrappedAuthorizationObserver);
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the public test environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forTest(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.testHost, REST_API_SECURE_PORT, 'test', WEBSOCKET_SECURE_PROTOCOL, Configuration.testHostForWebSocket), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the private development environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forDevelopment(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.developmentHost, REST_API_SECURE_PORT, 'development', WEBSOCKET_SECURE_PROTOCOL, Configuration.developmentHostForWebSocket), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the private staging environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forStaging(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.stagingHost, REST_API_SECURE_PORT, 'staging', WEBSOCKET_SECURE_PROTOCOL, Configuration.stagingHostForWebSocket), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the private demo environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forDemo(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.demoHost, REST_API_SECURE_PORT, 'demo', WEBSOCKET_SECURE_PROTOCOL, Configuration.demoHost), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the private admin environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forAdmin(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.adminHost, REST_API_SECURE_PORT, 'admin', WEBSOCKET_SECURE_PROTOCOL, Configuration.adminHostForWebSocket), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link WatchlistGateway} for use in the public production environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<WatchlistGateway>}
		 */
		static forProduction(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					return start(new WatchlistGateway(REST_API_SECURE_PROTOCOL, Configuration.productionHost, REST_API_SECURE_PORT, 'production', WEBSOCKET_SECURE_PROTOCOL, Configuration.productionHostForWebSocket), jwtProvider);
				});
		}

		_onDispose() {
			this._authorizationEvent.clear();
			this._authorizationEvent = null;
		}

		toString() {
			return '[WatchlistGateway]';
		}
	}

	function start(gateway, jwtProvider) {
		return gateway.connect(jwtProvider)
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
