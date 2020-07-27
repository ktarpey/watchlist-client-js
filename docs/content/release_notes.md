# Release Notes

## 5.0.2
**Bug Fixes**

* Added missing "is" dependency in the WatchlistGateway.

## 5.0.1
**New Features**

* An optional ```index``` parameter was added to the ```WatchlistGateway.addSymbol``` function.

## 5.0.0
**Breaking Changes**

* The function signature of ```WatchlistGateway.editWatchlist``` changed. The ```watchlistId``` argument was removed. The watchlist identifier must be present on the ```watchlist``` argument as ```watchlist.id```.

## 4.0.0
**Breaking Changes**

* Renamed ```WatchlistGateway.subscribe``` function to ```WatchlistGateway.subscribeWatchlists```.
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

