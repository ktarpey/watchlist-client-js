# Paths

## GET /watchlists 

> Returns watchlists owned by the current user. If the user has not watchlists, an empty array is returned.

**Summary**: Returns watchlists owned by the current user.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Headers

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| X-BARCHART-CLIENT-ID | <code>String</code> | false | false | An identifier for the connection (used to suppress WebSocket echo). |

#### Responses

**Status Code**: 200

> An array of watchlists.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## POST /watchlists 

> Creates a new watchlist for the current user.

**Summary**: Creates a new watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Headers

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| X-BARCHART-CLIENT-ID | <code>String</code> | false | false | An identifier for the connection (used to suppress WebSocket echo). |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | true | false |  |
| context | <code>String</code> | true | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>entries</code>](/content/api/components?id=schemasentries) | true | false |  |
| preferences | [<code>preferences</code>](/content/api/components?id=schemaspreferences) |  | false |  |

**Example**:

```json
{
  "name": "Watchlist name",
  "context": "BARCHART",
  "view": "main",
  "entries": [
    {
      "symbol": "TSLA",
      "notes": {
        "property1": null,
        "property2": null
      }
    }
  ],
  "preferences": {
    "sorting": {
      "column": "symbol",
      "desc": false
    }
  }
}
```

#### Responses

**Status Code**: 200

> The newly created watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 400 - [BadRequest](/content/api/components?id=responsesbadrequest)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 403 - [Forbidden](/content/api/components?id=responsesforbidden)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## DELETE /watchlists/{watchlist} 

> Deletes a watchlist, given the watchlist identitifer.

**Summary**: Deletes a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Headers

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| X-BARCHART-CLIENT-ID | <code>String</code> | false | false | An identifier for the connection (used to suppress WebSocket echo). |

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |

#### Responses

**Status Code**: 200

> The identitifer of deleted watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | false | false |  |

**Example**:

```json
{
  "watchlist": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21"
}
```

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /watchlists/{watchlist} 

> Edits a watchlist, given the watchlist identitifer.

**Summary**: Edits a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Headers

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| X-BARCHART-CLIENT-ID | <code>String</code> | false | false | An identifier for the connection (used to suppress WebSocket echo). |

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | true | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>entries</code>](/content/api/components?id=schemasentries) | true | false |  |
| preferences | [<code>preferences</code>](/content/api/components?id=schemaspreferences) |  | false |  |

**Example**:

```json
{
  "name": "Watchlist name",
  "view": "main",
  "entries": [
    {
      "symbol": "TSLA",
      "notes": {
        "property1": null,
        "property2": null
      }
    }
  ],
  "preferences": {
    "sorting": {
      "column": "symbol",
      "desc": false
    }
  }
}
```

#### Responses

**Status Code**: 200

> The newly edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 400 - [BadRequest](/content/api/components?id=responsesbadrequest)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /watchlists/{watchlist}/preferences 

> Edit watchlist preferences, given the watchlist identitifer.

**Summary**: Edit preferences for a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |

#### Request Body
    
**Content Type**: application/json

**Type**: [<code>Array&lt;preferences&gt;</code>](/content/api/components?id=schemaspreferences)

**Example**:

```json
{
  "sorting": {
    "column": "symbol",
    "desc": false
  }
}
```

#### Responses

**Status Code**: 200

> The edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /watchlists/{watchlist}/symbols 

> Adds a symbol a watchlist.

**Summary**: Adds a symbol to a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| entry | [<code>entry</code>](/content/api/components?id=schemasentry) |  | false |  |
| index | <code>Integer</code> | false | false | The index at which the symbol will be inserted |

**Example**:

```json
{
  "entry": {
    "symbol": "TSLA",
    "notes": {
      "property1": null,
      "property2": null
    }
  },
  "index": 3
}
```

#### Responses

**Status Code**: 200

> The newly edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 400 - [BadRequest](/content/api/components?id=responsesbadrequest)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## DELETE /watchlists/{watchlist}/symbols/{symbol} 

> Deletes a symbol a watchlist.

**Summary**: Deletes a symbol a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Headers

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| X-BARCHART-CLIENT-ID | <code>String</code> | false | false | An identifier for the connection (used to suppress WebSocket echo). |

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |
| symbol | <code>String</code> | true | false | A symbol to delete. |

#### Responses

**Status Code**: 200

> A JSON object of edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /watchlists/{watchlist}/symbols/{symbol} 

> Changes the relative position of a symbol on a watchlist.

**Summary**: Changes the relative position of a symbol on a watchlist.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| watchlist | <code>String</code> | true | false | The identifier of the watchlist. |
| symbol | <code>String</code> | true | false | The symbol to move. |

#### Request Body
    
**Content Type**: application/json

**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| from | <code>Integer</code> | true | false | The old index. |
| to | <code>Integer</code> | true | false | The new index. |

**Example**:

```json
{
  "from": 3,
  "to": 5
}
```

#### Responses

**Status Code**: 200

> The newly edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 400 - [BadRequest](/content/api/components?id=responsesbadrequest)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 404 - [NotFound](/content/api/components?id=responsesnotfound)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

