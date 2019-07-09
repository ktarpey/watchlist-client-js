const JwtEndpoint = require('./gateway/jwt/JwtEndpoint'),
	JwtGateway = require('./gateway/jwt/JwtGateway');

const WatchlistGateway = require('./gateway/WatchlistGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtEndpoint: JwtEndpoint,
		JwtGateway: JwtGateway,
		WatchlistGateway: WatchlistGateway,
		version: '1.3.1'
	};
})();