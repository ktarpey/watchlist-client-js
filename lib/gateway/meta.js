/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The function signature for a callback which is invoked when watchlists change.
 *
 * @public
 * @callback SubscriptionMessageCallback
 * @memberOf Callbacks
 * @param {Object} data - The data received.
 */

/**
 * The function signature for a callback that is invoked when subscription
 * status changes.
 *
 * @public
 * @callback SubscriptionStatusCallback
 * @memberOf Callbacks
 * @param {Enums.SubscriptionStatus} status - The current status.
 */

/**
 * A namespace for enumerations.
 *
 * @namespace Enums
 */

/**
 * The mutually-exclusive states for a Subscription connection.
 *
 * @name SubscriptionStatus
 * @enum {String}
 * @memberOf Enums
 * @property IDLE - The connection has not been initialized.
 * @property DISCONNECTED - No connection is being negotiated.
 * @property CONNECTING - The connection is being negotiated.
 * @property CONNECTED - The connection is active.
 */