const WatchlistGateway = require('./gateway/WatchlistGateway');

module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		version: '6.0.0'
	};
})();
