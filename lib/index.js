const WatchlistGateway = require('./gateway/WatchlistGateway');

module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		version: '8.4.0'
	};
})();
