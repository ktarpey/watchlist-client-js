const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Serializer = require('@barchart/common-js/timing/Serializer');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-client-js/http/Gateway'),
	PathParameterType = require('@barchart/common-client-js/http/definitions/PathParameterType'),
	RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor');

const WatchlistUser = require('@barchart/watchlist-api-common/WatchlistUser');

const WatchlistGatewayConfiguration = require('./WatchlistGatewayConfiguration');

module.exports = (() => {
	'use strict';

	/**
	 * Web service gateway for invoking the Watchlist API.
	 *
	 * @public
	 */
	class WatchlistGateway {
		constructor() {
			this._startPromise = null;
			this._started = false;

			this._readEndpoint = null;
			this._writeEndpoint = null;

			this._serializer = new Serializer();
		}

		start(configuration) {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise !== null) {
						return this._startPromise;
					}

					assert.argumentIsOptional(configuration, 'configuration', WatchlistGatewayConfiguration, 'WatchlistGatewayConfiguration');

					const configurationToUse = configuration || WatchlistGatewayConfiguration.DEFAULT;

					this._startPromise = Promise.resolve()
						.then(() => {
							this._readEndpoint = EndpointBuilder.for('read-user')
								.withVerb(VerbType.GET)
								.withProtocol(configurationToUse.protocol)
								.withHost(configurationToUse.host)
								.withPort(configurationToUse.port)
								.withPathParameter('v1', PathParameterType.STATIC)
								.withPathParameter('user', PathParameterType.STATIC)
								.withRequestInterceptor(configuration.requestInterceptorForJwt)
								.withResponseInterceptor(responseInterceptorForDeserialization)
								.endpoint;

							this._writeEndpoint = EndpointBuilder.for('write-user')
								.withVerb(VerbType.PUT)
								.withProtocol(configurationToUse.protocol)
								.withHost(configurationToUse.host)
								.withPort(configurationToUse.port)
								.withPathParameter('v1', PathParameterType.STATIC)
								.withPathParameter('user', PathParameterType.STATIC)
								.withRequestInterceptor(configuration.requestInterceptorForJwt)
								.withRequestInterceptor(requestInterceptorForSerialization)
								.endpoint;

							return this._started = true;
						});
				});
		}

		readUser() {
			return Promise.resolve()
				.then(() => {
					if (!this._started) {
						throw new Error('Unable to write watchlist user, the gateway has not started.');
					}

					return Gateway.invoke(this._readEndpoint)
						.then((response) => {

						});
				});
		}

		writeUser(watchlistUser) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(watchlistUser, 'watchlistUser', WatchlistUser, 'WatchlistUser');

					if (!this._started) {
						throw new Error('Unable to write watchlist user, the gateway has not started.');
					}

					return Gateway.invoke(this._writeEndpoint, watchlistUser)
						.then((response) => {

						});
				});
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

	const responseInterceptorForDeserialization = ResponseInterceptor.fromDelegate((request) => {
		return WatchlistUser.fromJSObj(request.data);
	});

	return WatchlistGateway;
})();