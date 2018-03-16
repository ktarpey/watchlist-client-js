const JwtEndpoint = require('./gateway/jwt/JwtEndpoint'),
	WatchlistGateway = require('./gateway/WatchlistGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtEndpoint: JwtEndpoint,
		WatchlistGateway: WatchlistGateway,
		version: '1.1.8'
	};
})();