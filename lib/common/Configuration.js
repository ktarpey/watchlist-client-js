module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
	 * @ignore
	 */
	class Configuration {
		constructor() {

		}

		/**
		 * The hostname of the REST API for the development environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHost() {
			return 'watchlist-dev.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the test environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get testHost() {
			return 'watchlist-test.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the staging environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return 'watchlist-stage.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the demo environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get demoHost() {
			return 'watchlist-demo.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the admin environment.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get adminHost() {
			return `17rkjc830f.execute-api.us-east-1.amazonaws.com/admin`;
		}

		/**
		 * The hostname of the REST API for the production environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'watchlist.aws.barchart.com';
		}

		/**
		 * The hostname of the WebSocket service for the development environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHostForWebSocket() {
			return 'watchlist-dev-websockets.aws.barchart.com';
		}

		/**
		 * The hostname of the WebSocket service for the test environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get testHostForWebSocket() {
			return 'watchlist-stage-websockets.aws.barchart.com';
		}

		/**
		 * The hostname of the WebSocket service for staging environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHostForWebSocket() {
			return 'watchlist-stage-websockets.aws.barchart.com';
		}

		/**
		 * The hostname of the WebSocket service for production environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHostForWebSocket() {
			return 'watchlist-websockets.aws.barchart.com';
		}

		/**
		 * The hostname of the WebSocket service for admin environment.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get adminHostForWebSocket() {
			return 'ypddm653ba.execute-api.us-east-1.amazonaws.com/admin';
		}

		/**
		 * The hostname of REST API which generates impersonation tokens for non-secure
		 * test and demo environments.
		 *
		 * @public
		 * @static
		 * @returns {string}
		 */
		static get getJwtImpersonationHost() {
			return 'jwt-public-prod.aws.barchart.com';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();
