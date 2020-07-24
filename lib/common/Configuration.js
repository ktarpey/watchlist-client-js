module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
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

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();
