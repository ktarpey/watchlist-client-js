# Components

## Responses 

### Unauthorized :id=responsesunauthorized
> Authorization failure.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Object</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "Unauthorized"
}
```

* * *

### BadRequest :id=responsesbadrequest
> Bad request.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

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
      "code": "WATCHLIST_CREATE_FAILED_SYMBOL_MISSING",
      "message": "Unable to create watchlist, the symbol is missing from at least one entry."
    },
    "children": []
  }
]
```

* * *

### Forbidden :id=responsesforbidden
> User is not authorized to use resource.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

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
      "code": "WATCHLIST_CREATE_FAILED_USER_FORBIDDEN",
      "message": "Unable to create watchlist for another user (watchlist user does not match authorized user)."
    },
    "children": []
  }
]
```

* * *

### NotFound :id=responsesnotfound
> Requested resource not found.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

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
      "code": "WATCHLIST_EDIT_FAILED_NO_WATCHLIST",
      "message": "Unable to edit watchlist, watchlist does not exist."
    },
    "children": []
  }
]
```

* * *

### ServerError :id=responsesservererror
> Server error.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

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

## Schemas 

### watchlist :id=schemaswatchlist
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | false | false |  |
| context | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>entries</code>](#schemasentries) |  | false |  |
| preferences | [<code>preferences</code>](#schemaspreferences) |  | false |  |
| user | <code>String</code> | false | false |  |
| system | [<code>system</code>](#schemassystem) |  | false |  |

**Example**:

```json
{
  "id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
  "context": "BARCHART",
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
  },
  "user": 113692067,
  "system": {
    "sequence": 1,
    "timestamp": 1580990379106
  }
}
```

* * *

### preferences :id=schemaspreferences
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| sorting | <code>Object</code> |  | false |  |
| sorting.column | <code>String</code> | false | false |  |
| sorting.desc | <code>Boolean</code> | false | false |  |

**Example**:

```json
{
  "sorting": {
    "column": "symbol",
    "desc": false
  }
}
```

* * *

### system :id=schemassystem
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| sequence | <code>Integer</code> | false | false |  |
| timestamp | <code>String</code> | false | false |  |

**Example**:

```json
{
  "sequence": 1,
  "timestamp": 1580990379106
}
```

* * *

### entries :id=schemasentries
**Type**: [<code>Array&lt;entry&gt;</code>](#schemasentry)

* * *

### entry :id=schemasentry
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| symbol | <code>String</code> | false | false |  |
| notes | <code>Object</code> | false | false |  |

**Example**:

```json
{
  "symbol": "TSLA",
  "notes": {
    "property1": null,
    "property2": null
  }
}
```

* * *

## Security 

### JWT :id=securityjwt

>

**Type**: http bearer
    
#### Headers
| Name | Format | Example |
| ---- | ------ | ------- |
| Authorization | JWT | Authorization: Bearer <code>&lt;Token&gt;</code> |

* * *

