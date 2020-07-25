/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * The result item for querying watchlists for a specific symbol.
 *
 * @typedef WatchlistSymbolQueryResult
 * @type Object
 * @memberOf Schema
 * @property {String} id - The watchlist identifier.
 * @property {String} name - The watchlist name.
 * @property {String} hasSymbol - True, if the watchlist contains the specific symbol.
 */

/**
 * An object describing the connection to the remote service.
 *
 * @typedef WatchlistServiceMetadata
 * @type Object
 * @memberOf Schema
 * @property {String} server.semver - The remote service's software version number.
 * @property {String} user.id - The current user's identifier.
 * @property {String} user.permissions - The current user's permission level.
 */