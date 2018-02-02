const WatchlistGateway = require('./gateway/WatchlistGateway'),
	WatchlistGatewayConfiguration = require('./gateway/WatchlistGatewayConfiguration');

module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		WatchlistGatewayConfiguration: WatchlistGatewayConfiguration,
		version: '1.0.1'
	};
})();