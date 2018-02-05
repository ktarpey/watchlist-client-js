const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-client-js/http/Gateway'),
	RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

const WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

const WatchlistJwtProvider = require('./WatchlistJwtProvider'),
	WatchlistServiceAddress = require('./WatchlistServiceAddress');

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
		 * @param {WatchlistServiceAddress} serviceAddress - Instructions for contacting the remote service.
		 * @param {WatchlistJwtProvider} jwtProvider - A function which returns the appropriate JWT token itself (or a promise for it).
		 * @returns {Promise.<WatchlistServerMetadata>}
		 */
		start(serviceAddress, jwtProvider) {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise === null) {
						this._startPromise = Promise.resolve()
							.then(() => {
								assert.argumentIsRequired(serviceAddress, 'serviceAddress', WatchlistServiceAddress, 'WatchlistServiceAddress');
								assert.argumentIsRequired(jwtProvider, 'jwtProvider', WatchlistJwtProvider, 'WatchlistJwtProvider');

								const requestInterceptorForJwt = RequestInterceptor.fromDelegate((request) => {
									return Promise.resolve()
										.then(() => {
											return jwtProvider.getJwtToken();
										}).then((token) => {
											request.headers = request.headers || {};
											request.headers.Authorization = `Bearer ${token}`;

											return request;
										});
								});

								const readServerMetadataEndpoint = EndpointBuilder.for('read-metadata')
									.withVerb(VerbType.GET)
									.withProtocol(serviceAddress.protocol)
									.withHost(serviceAddress.host)
									.withPort(serviceAddress.port)
									.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('server'))
									.withResponseInterceptor(ResponseInterceptor.DATA)
									.endpoint;

								return Gateway.invoke(readServerMetadataEndpoint)
									.then((metadata) => {
										this._readUserEndpoint = EndpointBuilder.for('read-user')
											.withVerb(VerbType.GET)
											.withProtocol(serviceAddress.protocol)
											.withHost(serviceAddress.host)
											.withPort(serviceAddress.port)
											.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('user'))
											.withRequestInterceptor(requestInterceptorForJwt)
											.withResponseInterceptor(responseInterceptorForDeserialization)
											.endpoint;

										this._writeUserEndpoint = EndpointBuilder.for('write-user')
											.withVerb(VerbType.PUT)
											.withProtocol(serviceAddress.protocol)
											.withHost(serviceAddress.host)
											.withPort(serviceAddress.port)
											.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('user'))
											.withEntireBody()
											.withRequestInterceptor(requestInterceptorForJwt)
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
	 * @typedef WatchlistServerMetadata
	 * @type {Object}
	 * @property {String} semver - The server version.
	 */

 	return WatchlistGateway;
})();