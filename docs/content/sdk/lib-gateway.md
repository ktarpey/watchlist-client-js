## Contents {docsify-ignore}

* [WatchlistGateway](#WatchlistGateway) 

* [Callbacks](#Callbacks) 

* [Enums](#Enums) 


* * *

## WatchlistGateway :id=watchlistgateway
> <p>Web service gateway for invoking the Watchlist API.</p>

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  

* [WatchlistGateway](#WatchlistGateway) ⇐ <code>Disposable</code>
    * _instance_
        * [.environment](#WatchlistGatewayenvironment) ⇒ <code>String</code>
        * [.clientId](#WatchlistGatewayclientId) ⇒ <code>String</code>
        * [.start()](#WatchlistGatewaystart) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
        * [.subscribe(messageCallback, statusCallback)](#WatchlistGatewaysubscribe) ⇒ <code>Promise</code>
        * [.readServiceMetadata()](#WatchlistGatewayreadServiceMetadata) ⇒ [<code>Promise.&lt;Schema.WatchlistServiceMetadata&gt;</code>](/content/sdk/lib-data?id=schemawatchlistservicemetadata)
        * [.readWatchlists()](#WatchlistGatewayreadWatchlists) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.editWatchlist(watchlistId, watchlist)](#WatchlistGatewayeditWatchlist) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.createWatchlist(watchlist)](#WatchlistGatewaycreateWatchlist) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.deleteWatchlist(watchlist)](#WatchlistGatewaydeleteWatchlist) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.addSymbol(watchlist, entry)](#WatchlistGatewayaddSymbol) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.deleteSymbol(watchlist, symbol)](#WatchlistGatewaydeleteSymbol) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.editPreferences(watchlist, preferences)](#WatchlistGatewayeditPreferences) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.querySymbol(symbol)](#WatchlistGatewayquerySymbol) ⇒ [<code>Promise.&lt;Array.&lt;Schema.WatchlistSymbolQueryResult&gt;&gt;</code>](/content/sdk/lib-data?id=schemawatchlistsymbolqueryresult)
    * _static_
        * [.forDevelopment(requestInterceptor)](#WatchlistGatewayforDevelopment) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
        * [.forTest(requestInterceptor)](#WatchlistGatewayforTest) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
        * [.forStaging(requestInterceptor)](#WatchlistGatewayforStaging) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
        * [.forDemo(requestInterceptor)](#WatchlistGatewayforDemo) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
        * [.forProduction(requestInterceptor)](#WatchlistGatewayforProduction) ⇒ [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)
    * _constructor_
        * [new WatchlistGateway(protocol, host, port, environment, [requestInterceptor])](#new_WatchlistGateway_new)


* * *

### watchlistGateway.environment :id=watchlistgatewayenvironment
> <p>Returns a description of the environment (e.g. development or production).</p>

**Kind**: instance property of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### watchlistGateway.clientId :id=watchlistgatewayclientid
> <p>A unique identifier for the instance.</p>

**Kind**: instance property of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### watchlistGateway.start() :id=watchlistgatewaystart
> <p>Initializes the connection to the remote server and returns a promise
> containing the current instance.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

* * *

### watchlistGateway.subscribe(messageCallback, statusCallback) :id=watchlistgatewaysubscribe
> <p>Subscribes to remote changes to watchlists (requires native WebSocket support).</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| messageCallback | [<code>WebSocketMessageCallback</code>](#CallbacksWebSocketMessageCallback) | 
| statusCallback | [<code>WebSocketStatusCallback</code>](#CallbacksWebSocketStatusCallback) | 


* * *

### watchlistGateway.readServiceMetadata() :id=watchlistgatewayreadservicemetadata
> <p>Retrieves the [Schema.WatchlistServiceMetadata](/content/sdk/lib-data?id=schemawatchlistservicemetadata) from the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;Schema.WatchlistServiceMetadata&gt;</code>](/content/sdk/lib-data?id=schemawatchlistservicemetadata)  
**Access**: public  

* * *

### watchlistGateway.readWatchlists() :id=watchlistgatewayreadwatchlists
> <p>Retrieves the watchlists from the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

* * *

### watchlistGateway.editWatchlist(watchlistId, watchlist) :id=watchlistgatewayeditwatchlist
> <p>Edits the watchlist in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlistId | <code>String</code> | 
| watchlist | <code>Object</code> | 


* * *

### watchlistGateway.createWatchlist(watchlist) :id=watchlistgatewaycreatewatchlist
> <p>Creates the watchlist in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlist | <code>Object</code> | 


* * *

### watchlistGateway.deleteWatchlist(watchlist) :id=watchlistgatewaydeletewatchlist
> <p>Deletes the watchlist in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlist | <code>String</code> | 


* * *

### watchlistGateway.addSymbol(watchlist, entry) :id=watchlistgatewayaddsymbol
> <p>Adds the symbol in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlist | <code>String</code> | 
| entry | <code>Object</code> | 


* * *

### watchlistGateway.deleteSymbol(watchlist, symbol) :id=watchlistgatewaydeletesymbol
> <p>Deletes the symbol in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlist | <code>String</code> | 
| symbol | <code>String</code> | 


* * *

### watchlistGateway.editPreferences(watchlist, preferences) :id=watchlistgatewayeditpreferences
> <p>Edit watchlist preferences in the remote server.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| watchlist | <code>String</code> | 
| preferences | <code>Object</code> | 


* * *

### watchlistGateway.querySymbol(symbol) :id=watchlistgatewayquerysymbol
> <p>Returns the list of watchlists names and a flag indicating whether the specified
> symbol is included in each watchlist.</p>

**Kind**: instance method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.WatchlistSymbolQueryResult&gt;&gt;</code>](/content/sdk/lib-data?id=schemawatchlistsymbolqueryresult)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 


* * *

### WatchlistGateway.forDevelopment(requestInterceptor) :id=watchlistgatewayfordevelopment
> <p>Creates and starts a new [WatchlistGateway](/content/sdk/lib-gateway?id=watchlistgateway) for use in the development environment.</p>

**Kind**: static method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestInterceptor | <code>RequestInterceptor</code> \| <code>Promise.&lt;RequestInterceptor&gt;&#x3D;</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

### WatchlistGateway.forTest(requestInterceptor) :id=watchlistgatewayfortest
> <p>Creates and starts a new [WatchlistGateway](/content/sdk/lib-gateway?id=watchlistgateway) for use in the test environment.</p>

**Kind**: static method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestInterceptor | <code>RequestInterceptor</code> \| <code>Promise.&lt;RequestInterceptor&gt;&#x3D;</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

### WatchlistGateway.forStaging(requestInterceptor) :id=watchlistgatewayforstaging
> <p>Creates and starts a new [WatchlistGateway](/content/sdk/lib-gateway?id=watchlistgateway) for use in the staging environment.</p>

**Kind**: static method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestInterceptor | <code>RequestInterceptor</code> \| <code>Promise.&lt;RequestInterceptor&gt;&#x3D;</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

### WatchlistGateway.forDemo(requestInterceptor) :id=watchlistgatewayfordemo
> <p>Creates and starts a new [WatchlistGateway](/content/sdk/lib-gateway?id=watchlistgateway) for use in the demo environment.</p>

**Kind**: static method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestInterceptor | <code>RequestInterceptor</code> \| <code>Promise.&lt;RequestInterceptor&gt;&#x3D;</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

### WatchlistGateway.forProduction(requestInterceptor) :id=watchlistgatewayforproduction
> <p>Creates and starts a new [WatchlistGateway](/content/sdk/lib-gateway?id=watchlistgateway) for use in the production environment.</p>

**Kind**: static method of [<code>WatchlistGateway</code>](#WatchlistGateway)  
**Returns**: [<code>Promise.&lt;WatchlistGateway&gt;</code>](#WatchlistGateway)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestInterceptor | <code>RequestInterceptor</code> \| <code>Promise.&lt;RequestInterceptor&gt;&#x3D;</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

### new WatchlistGateway(protocol, host, port, environment, [requestInterceptor]) :id=new_watchlistgateway_new
**Kind**: constructor of [<code>WatchlistGateway</code>](#WatchlistGateway)  

| Param | Type | Description |
| --- | --- | --- |
| protocol | <code>String</code> | <p>The protocol to use (either HTTP or HTTPS).</p> |
| host | <code>String</code> | <p>The host name of the Watchlist web service.</p> |
| port | <code>Number</code> | <p>The TCP port number of the Watchlist web service.</p> |
| environment | <code>String</code> | <p>A description of the environment we're connecting to.</p> |
| [requestInterceptor] | <code>RequestInterceptor</code> | <p>A request interceptor used with each request (typically used to inject JWT tokens).</p> |


* * *

## Callbacks :id=callbacks
> <p>A meta namespace containing signatures of anonymous functions.</p>

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.WebSocketMessageCallback](#CallbacksWebSocketMessageCallback) : <code>function</code>
        * [.WebSocketStatusCallback](#CallbacksWebSocketStatusCallback) : <code>function</code>


* * *

### Callbacks.WebSocketMessageCallback :id=callbackswebsocketmessagecallback
> <p>The function signature of a callback that is invoked when data is received from
> the WebSocket connection.</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | <p>The data received.</p> |


* * *

### Callbacks.WebSocketStatusCallback :id=callbackswebsocketstatuscallback
> <p>The function signature of a callback that is invoked when the status
> of a WebSocket changes (e.g. connect, disconnect).</p>

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| status | [<code>WebSocketStatus</code>](#EnumsWebSocketStatus) | <p>The current status.</p> |


* * *

## Enums :id=enums
> <p>A namespace for enumerations.</p>

**Kind**: global namespace  

* * *

### Enums.WebSocketStatus :id=enumswebsocketstatus
> <p>The mutually-exclusive states for a WebSocket connection.</p>

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Properties**

| Name | Description |
| --- | --- |
| IDLE | <p>The connection has not been initialized.</p> |
| DISCONNECTED | <p>No connection is being negotiated.</p> |
| CONNECTING | <p>The connection is being negotiated.</p> |
| CONNECTED | <p>The connection is active.</p> |


* * *

