# Components

## Responses 

### Unauthorized :id=responsesunauthorized
> Authorization failure

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

## Schemas 

### watchlist :id=schemaswatchlist
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | false | false |  |
| context | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false |  |
| view | <code>String</code> | false | false |  |
| entries | [<code>Entries</code>](#schemasentries) |  | false |  |
| preferences | [<code>Preferences</code>](#schemaspreferences) |  | false |  |
| user | <code>String</code> | false | false |  |
| system | [<code>System</code>](#schemassystem) |  | false |  |

**Example**:

```json
{
  "id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
  "context": "TGAM",
  "name": "Watchlist name",
  "view": "main",
  "entries": [
    {
      "symbol": "TSLA",
      "tgam_symbol": "TSLA-Q",
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
**Type**: [<code>Array&lt;Symbol&gt;</code>](#schemassymbol)

* * *

### symbol :id=schemassymbol
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| symbol | <code>String</code> | false | false |  |
| tgam_symbol | <code>String</code> | false | false |  |
| notes | <code>Object</code> | false | false |  |

**Example**:

```json
{
  "symbol": "TSLA",
  "tgam_symbol": "TSLA-Q",
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

