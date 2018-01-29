const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-client-js/http/Gateway'),
	PathParameterType = require('@barchart/common-client-js/http/definitions/PathParameterType'),
	RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

const WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

const WatchlistGatewayConfiguration = require('./WatchlistGatewayConfiguration');

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

			this._startPromise = null;
			this._started = false;

			this._readUserEndpoint = null;
			this._writeUserEndpoint = null;

			this._readMetadataEndpoint = null;
		}

		start(configuration) {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise === null) {
						assert.argumentIsOptional(configuration, 'configuration', WatchlistGatewayConfiguration, 'WatchlistGatewayConfiguration');

						const configurationToUse = configuration || WatchlistGatewayConfiguration.DEFAULT;

						this._startPromise = Promise.resolve()
							.then(() => {
								this._readUserEndpoint = EndpointBuilder.for('read-user')
									.withVerb(VerbType.GET)
									.withProtocol(configurationToUse.protocol)
									.withHost(configurationToUse.host)
									.withPort(configurationToUse.port)
									.withPathParameter('v1', PathParameterType.STATIC)
									.withPathParameter('user', PathParameterType.STATIC)
									.withRequestInterceptor(configuration.requestInterceptorForJwt)
									.withResponseInterceptor(responseInterceptorForDeserialization)
									.endpoint;

								this._writeUserEndpoint = EndpointBuilder.for('write-user')
									.withVerb(VerbType.PUT)
									.withProtocol(configurationToUse.protocol)
									.withHost(configurationToUse.host)
									.withPort(configurationToUse.port)
									.withPathParameter('v1', PathParameterType.STATIC)
									.withPathParameter('user', PathParameterType.STATIC)
									.withRequestInterceptor(configuration.requestInterceptorForJwt)
									.withRequestInterceptor(requestInterceptorForSerialization)
									.endpoint;

								this._readMetadataEndpoint = EndpointBuilder.for('read-metadata')
									.withVerb(VerbType.GET)
									.withProtocol(configurationToUse.protocol)
									.withHost(configurationToUse.host)
									.withPort(configurationToUse.port)
									.withPathParameter('v1', PathParameterType.STATIC)
									.withPathParameter('server', PathParameterType.STATIC)
									.withResponseInterceptor(ResponseInterceptor.JSON)
									.endpoint;

								return this._started = true;
						});
					}

					return this._startPromise;
				});
		}

		readUser() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._readUserEndpoint)
						.then((response) => {

						});
				});
		}

		writeUser(watchlistUser) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlistUser, 'watchlistUser', WatchlistUser, 'WatchlistUser');

					checkStart.call(this);

					return Gateway.invoke(this._writeUserEndpoint, watchlistUser);
				});
		}

		getServerVersion() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._readMetadataEndpoint);
				});
		}

		_onDispose() {

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
		return WatchlistUser.fromJSObj(response.data);
	});

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