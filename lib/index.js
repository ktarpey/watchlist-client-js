const WatchlistGateway = require('./gateway/WatchlistGateway'),
	WatchlistJwtProvider = require('./gateway/WatchlistJwtProvider'),
	WatchlistServiceAddress = require('./gateway/WatchlistServiceAddress');


module.exports = (() => {
	'use strict';

	return {
		WatchlistGateway: WatchlistGateway,
		WatchlistJwtProvider: WatchlistJwtProvider,
		WatchlistServiceAddress: WatchlistServiceAddress,
		version: '1.0.3'
	};
})();