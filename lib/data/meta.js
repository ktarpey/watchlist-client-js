/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * A watchlist.
 *
 * @typedef Watchlist
 * @type Object
 * @memberOf Schema
 * @property {String} id - The watchlist identifier. Omit when creating a new watchlist — the backend will assign an identifier.
 * @property {String} user - The user identifier for the watchlist's owner. Omit when creating a new watchlist — the backend will assign.
 * @property {String} context - The context identifier for the watchlist's owner. Omit when creating a new watchlist — the backend will assign.
 * @property {String} name - The name of the watchlist.
 * @property {WatchlistEntry[]} preferences - The ordered list of watchlist items (i.e. investments).
 * @property {WatchlistPreferences} preferences - An object containing display preferences (e.g. sort order for entries). This property can be omitted when creating a new watchlist.
 */

/**
 * An item in the watchlist. A ```symbol``` property must exist. Additional ad hoc properties
 * can be added -- as long as they have ```String```, ```Boolean```, or ```Number``` values.
 *
 * @typedef WatchlistEntry
 * @type Object
 * @memberOf Schema
 * @property {String} symbol - The unique identifier of the
 */

/**
 * An object which contains display preferences.
 *
 * @typedef WatchlistPreferences
 * @type Object
 * @memberOf Schema
 * @property {String=} sorting.column - The name of the column (attribute) used to sort the entries. This is independent of the natural order of items in the array.
 * @property {Boolean=} sorting.desc - The direction of the sorting applied to entries. This is independent of the natural order of items in the array.
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
 * @property {String} server.environment - The remote service's environment name (e.g. production, test, staging, etc).
 * @property {String} user.id - The current user's identifier.
 * @property {String} user.permissions - The current user's permission level.
 * @property {String} context.id - The current user's context (i.e. Barchart customer identifier).
 */