## Schema :id=schema
> <p>A meta namespace containing structural contracts of anonymous objects.</p>

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Watchlist](#SchemaWatchlist) : <code>Object</code>
        * [.WatchlistEntry](#SchemaWatchlistEntry) : <code>Object</code>
        * [.WatchlistPreferences](#SchemaWatchlistPreferences) : <code>Object</code>
        * [.WatchlistSymbolQueryResult](#SchemaWatchlistSymbolQueryResult) : <code>Object</code>
        * [.WatchlistServiceMetadata](#SchemaWatchlistServiceMetadata) : <code>Object</code>


* * *

### Schema.Watchlist :id=schemawatchlist
> <p>A watchlist.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | <p>The watchlist identifier. Omit when creating a new watchlist — the backend will assign an identifier.</p> |
| user | <code>String</code> | <p>The user identifier for the watchlist's owner. Omit when creating a new watchlist — the backend will assign.</p> |
| context | <code>String</code> | <p>The context identifier for the watchlist's owner. Omit when creating a new watchlist — the backend will assign.</p> |
| name | <code>String</code> | <p>The name of the watchlist.</p> |
| preferences | <code>Array.&lt;WatchlistEntry&gt;</code> | <p>The ordered list of watchlist items (i.e. investments).</p> |
| preferences | <code>WatchlistPreferences</code> | <p>An object containing display preferences (e.g. sort order for entries). This property can be omitted when creating a new watchlist.</p> |


* * *

### Schema.WatchlistEntry :id=schemawatchlistentry
> <p>An item in the watchlist. A <code>symbol</code> property must exist. Additional ad hoc properties
> can be added -- as long as they have <code>String</code>, <code>Boolean</code>, or <code>Number</code> values.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>String</code> | <p>The unique identifier of the</p> |


* * *

### Schema.WatchlistPreferences :id=schemawatchlistpreferences
> <p>An object which contains display preferences.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [sorting.column] | <code>String</code> | <p>The name of the column (attribute) used to sort the entries. This is independent of the natural order of items in the array.</p> |
| [sorting.desc] | <code>Boolean</code> | <p>The direction of the sorting applied to entries. This is independent of the natural order of items in the array.</p> |


* * *

### Schema.WatchlistSymbolQueryResult :id=schemawatchlistsymbolqueryresult
> <p>The result item for querying watchlists for a specific symbol.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | <p>The watchlist identifier.</p> |
| name | <code>String</code> | <p>The watchlist name.</p> |
| hasSymbol | <code>String</code> | <p>True, if the watchlist contains the specific symbol.</p> |


* * *

### Schema.WatchlistServiceMetadata :id=schemawatchlistservicemetadata
> <p>An object describing the connection to the remote service.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| server.semver | <code>String</code> | <p>The remote service's software version number.</p> |
| server.environment | <code>String</code> | <p>The remote service's environment name (e.g. production, test, staging, etc).</p> |
| user.id | <code>String</code> | <p>The current user's identifier.</p> |
| user.permissions | <code>String</code> | <p>The current user's permission level.</p> |
| context.id | <code>String</code> | <p>The current user's context (i.e. Barchart customer identifier).</p> |


* * *

