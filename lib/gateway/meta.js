/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The function signature of a callback that is invoked when data is received from
 * the WebSocket connection.
 *
 * @public
 * @callback WebSocketMessageCallback
 * @memberOf Callbacks
 * @param {Object} data - The data received.
 */

/**
 * The function signature of a callback that is invoked when the status
 * of a WebSocket changes (e.g. connect, disconnect).
 *
 * @public
 * @callback WebSocketStatusCallback
 * @memberOf Callbacks
 * @param {Enums.WebSocketStatus} status - The current status.
 */

/**
 * A namespace for enumerations.
 *
 * @namespace Enums
 */

/**
 * The mutually-exclusive states for a WebSocket connection.
 *
 * @name WebSocketStatus
 * @enum {String}
 * @memberOf Enums
 * @property DISCONNECTED - No connection is being negotiated.
 * @property CONNECTING - The connection is being negotiated.
 * @property CONNECTED - The connection is active.
 */