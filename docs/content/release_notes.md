# Release Notes

## 4.0.0
**Breaking Changes**

* Renamed **WatchlistGateway.subscribe** function to **WatchlistGateway.subscribeWatchlists**.
* Removed ```WatchlistGateway.clientId``` property.



## 3.3.2
**Bug Fixes**

* Implemented ```WatchlistGateway.querySymbol``` function, previous version was a stub.

**Other**

* Auto-generated SDK documentation.

## 3.3.0
**New Features**

* Added ```WatchlistGateway.querySymbol``` function, listing all watchlists which contain a specific symbol.

**Changes and Bug Fixes**

* Refactored WebSocket connections.
* Removed functions which should never have been public (```WatchlistGateway.setupWebsocket``` and ```WatchlistGateway.connectWebsocket```).

## 3.2.1
**Changes**

* Fixed a typo. `testtHostForWebSocket` has been renamed to `testHostForWebSocket` in `lib/common/Configuration.js` file.


## 3.2.0
**Non-functional Changes**

* Added example page.

