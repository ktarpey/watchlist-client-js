## Schema :id=schema
> <p>A meta namespace containing structural contracts of anonymous objects.</p>

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.WatchlistServiceMetadata](#SchemaWatchlistServiceMetadata) : <code>Object</code>
        * [.WatchlistSymbolQueryResult](#SchemaWatchlistSymbolQueryResult) : <code>Object</code>


* * *

### Schema.WatchlistServiceMetadata :id=schemawatchlistservicemetadata
> <p>An object describing the connection to the remote service.</p>

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| server.semver | <code>String</code> | <p>The remote service version.</p> |
| user.id | <code>String</code> | <p>The current user's identifier.</p> |
| user.permissions | <code>String</code> | <p>The current user's permission level.</p> |


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

