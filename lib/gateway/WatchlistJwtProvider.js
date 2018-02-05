const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

const EndpointBuilder = require('@barchart/common-client-js/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-client-js/http/Gateway'),
	RequestInterceptor = require('@barchart/common-client-js/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-client-js/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-client-js/http/definitions/VerbType');

const WatchlistServiceAddress = require('./WatchlistServiceAddress');

module.exports = (() => {
	'use strict';

	/**
	 * A contract for generating JWT tokens.
	 *
	 * @public
	 * @interface
	 * @extends {Disposable}
	 */
	class WatchlistJwtProvider extends Disposable {
		constructor() {
			super();
		}

		/**
		 * Returns a JWT token (or a promise for a JWT token).
		 *
		 * @public
		 * @returns {String|Promise<String>|null}
		 */
		getJwtToken() {
			return this._getJwtToken();
		}

		/**
		 * @protected
		 * @ignore
		 * @returns {String|Promise<String>|null}
		 */
		_getJwtToken() {
			return null;
		}

		/**
		 * Returns a {@link WatchlistJwtProvider} for use with the development environment.
		 *
		 * @param {WatchlistServiceAddress} serviceAddress
		 * @param {String} userId
		 */
		static forDevelopment(serviceAddress, userId) {
			return new WatchlistJwtProviderForDevelopment(serviceAddress, userId);
		}

		_onDispose() {
			return;
		}

		toString() {
			return `[WatchlistJwtProvider]`;
		}
	}

	class WatchlistJwtProviderForDevelopment extends WatchlistJwtProvider {
		constructor(serviceAddress, userId) {
			super();

			assert.argumentIsRequired(serviceAddress, 'serviceAddress', WatchlistServiceAddress, 'WatchlistServiceAddress');
			assert.argumentIsRequired(userId, 'userId', String);

			this._serviceAddress = serviceAddress;
			this._userId = userId;

			this._currentTokenPromise = null;

			this._scheduler = new Scheduler();
		}

		_getJwtToken() {
			if (this.getIsDisposed()) {
				return Promise.reject('The JWT provider has been disposed.');
			}

			if (this._currentTokenPromise === null) {
				const readJwtTokenForDevelopmentEndpoint = EndpointBuilder.for('read-jwt-token-for-development')
					.withVerb(VerbType.GET)
					.withProtocol(this._serviceAddress.protocol)
					.withHost(this._serviceAddress.host)
					.withPort(this._serviceAddress.port)
					.withPathBuilder((pb) => pb.withLiteralParameter('v1').withLiteralParameter('token'))
					.withQueryBuilder((qb) => qb.withLiteralParameter('userId', this._userId))
					.withResponseInterceptor(ResponseInterceptor.DATA)
					.endpoint;

				const refreshToken = () => Gateway.invoke(readJwtTokenForDevelopmentEndpoint, { });

				this._currentTokenPromise = refreshToken();

				this._scheduler.repeat(() => this._currentTokenPromise = refreshToken(), 300000, 'Refresh JWT token');
			}

			return this._currentTokenPromise;
		}

		_onDispose() {
			this._scheduler.dispose();
		}
	}

	return WatchlistJwtProvider;
})();