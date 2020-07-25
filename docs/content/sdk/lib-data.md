## Schema :id=schema
> <p>A meta namespace containing structural contracts of anonymous objects.</p>

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.WatchlistSymbolQueryResult](#SchemaWatchlistSymbolQueryResult) : <code>Object</code>
        * [.WatchlistServiceMetadata](#SchemaWatchlistServiceMetadata) : <code>Object</code>


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
| server.semver | <code>String</code> | <p>The version number of the remote service.</p> |
| user.id | <code>String</code> | <p>The current user's identifier.</p> |
| user.permissions | <code>String</code> | <p>The current user's permission level.</p> |


* * *

