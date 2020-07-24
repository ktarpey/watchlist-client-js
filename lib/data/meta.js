/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * Watchlist server metadata.
 *
 * @typedef WatchlistServiceMetadata
 * @type Object
 * @memberOf Schema
 * @property {String} server.semver - The server version.
 * @property {String} user.id - The current user's identifier.
 * @property {String} user.permissions - The current user's permission level.
 */

/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The function signature for a callback which notifies
 *
 * @public
 * @callback WebSocketDataReceiveCallback
 * @memberOf Callbacks
 * @param {Object} data - The data received from the websocket.
 */