const WatchlistGateway = require('./gateway/WatchlistGateway');


module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		version: '1.0.10'
	};
})();