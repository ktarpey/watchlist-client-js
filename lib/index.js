const WatchlistGateway = require('./gateway/WatchlistGateway');

module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		version: '5.0.2'
	};
})();
