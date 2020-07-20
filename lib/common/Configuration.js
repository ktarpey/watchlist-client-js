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
			return '6tyutdt1lf.execute-api.us-east-1.amazonaws.com/dev';
		}

		/**
		 * The hostname of the WebSocket service for the test environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get testtHostForWebSocket() {
			return '3b9tnvealg.execute-api.us-east-1.amazonaws.com/test';
		}

		/**
		 * The hostname of the WebSocket service for staging environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHostForWebSocket() {
			return '85i5mijnnb.execute-api.us-east-1.amazonaws.com/stage';
		}

		/**
		 * The hostname of the WebSocket service for production environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHostForWebSocket() {
			return 'lufdkfctyk.execute-api.us-east-1.amazonaws.com/prod';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();
