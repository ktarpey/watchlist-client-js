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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

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
| name | <code>String</code> | false | false |  |
| context | <code>String</code> | false | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>Entries</code>](/content/api/components?id=schemasentries) | true | false |  |
| preferences | [<code>Preferences</code>](/content/api/components?id=schemaspreferences) | false | false |  |

**Example**:

```json
{
  "name": "Watchlist name",
  "context": "TGAM",
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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to create watchlist failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to delete watchlist failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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
| context | <code>String</code> | true | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>Entries</code>](/content/api/components?id=schemasentries) | true | false |  |

**Example**:

```json
{
  "name": "Watchlist name",
  "context": "TGAM",
  "view": "main",
  "entries": [
    {
      "symbol": "TSLA",
      "notes": {
        "property1": null,
        "property2": null
      }
    }
  ]
}
```

#### Responses

**Status Code**: 200

> The newly edited watchlist.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to edit watchlist failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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

**Type**: [<code>Array&lt;Preferences&gt;</code>](/content/api/components?id=schemaspreferences)

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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to edit preferences failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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
| entry | [<code>Entry</code>](/content/api/components?id=schemasentry) | true | false |  |
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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to add symbols failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to delete symbol failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

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
| from | <code>Integer</code> | false | false | The old index. |
| to | <code>Integer</code> | false | false | The new index. |

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

**Response Type:** [<code>Array&lt;Watchlist&gt;</code>](/content/api/components?id=schemaswatchlist)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id&#x3D;responsesunauthorized)

* * *

**Status Code**: 500

> A JSON representatin of the error.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Array&lt;Object&gt;</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> |  | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to change index failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

* * *

