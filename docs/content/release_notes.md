# Release Notes

## 8.2.4
**Other**

* Updated hostname for _admin_ environment.
* Updated hostname for WebSocket connections.

## 8.2.3
**No Functional Changes**

* Added Data Structures section to documentation. Documentation is complete.

## 8.2.1
**No Functional Changes**

* Documentation Updated
  * Completed JavaScript example code to Quick Start section.
  * Completed JavaScript example code to Security section.
  * Added description of example applications to Quick Start section.
  * Other miscellaneous clarifications.
* Example Application Added for Node.js

## 8.2.0
**New Features**

* The example application now allows the user to specify a user to impersonate (in the _test_ environment only).

## 8.1.0
**New Features**

* Added ```JwtProvider.forAdmin``` function.

## 8.0.0
**Breaking Changes**

* The backend WebSocket connection has been updated. No code change is required in consumer code.

## 7.1.0
**New Features**

* Added static factory function for ```JwtProvider``` class.

**Other**

* Improved refresh logic for JWT.

## 7.0.0
**Breaking Changes**

* The mechanism for passing JSON Web Tokens to the ```WatchlistGateway``` has changed. Consumers are now required to provide ```JwtProvider``` instances instead of a ```RequestInterceptor``` instances. Here are the specifics:
  * The ```RequestInterceptor``` argument was replaced with a ```JwtProvider``` argument on static factory functions (e.g. ```WatchlistGateway.forProduction```).
  * The ```RequestInterceptor``` argument was removed from the ```WatchlistGateway``` constructor.
  * The ```WatchlistGateway.start``` function was renamed to ```WatchlistGateway.connect``` and now has a ```JwtProvider``` argument.
  * The ```JwtGateway``` and ```JwtEndpoint``` classes were removed.
  * Static factory functions for impersonating users in the ```test``` and ```development``` environments were added. See ```JwtProvider.forTest``` and ```JwtProvider.forDevelopment```.

## 5.0.2
**Bug Fixes**

* Corrected missing dependency which caused ```WatchlistGateway``` to be completely inoperable.

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

