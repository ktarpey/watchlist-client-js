# @barchart/aws-lambda-watchlist

## API

The HTTP-based API exposes operations:

- [Create watchlist](#create-watchlist)
- [Read watchlist](#read-watchlist)
- [Edit watchlist](#edit-watchlist)
- [Delete watchlist](#delete-watchlist)
- [Edit preferences](#edit-preferences)
- [Add symbol](#add-symbol)
- [Delete symbol](#delete-symbol)
- [Change symbol index](#change-symbol-index)

### Semantics

The API accepts JSON formatted data in the body of HTTP requests and returns JSON data in HTTP responses.

### Security

The API will only communicate over the HTTPS protocol.

It uses [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) to validate your identity. Contact Barchart for your username and password.

Your HTTP request header should include the following:

> Authorization: Bearer {JWT}

### Public Host

The production environment can be accessed at:

> watchlist.aws.barchart.com

### Watchlist Structure

The Watchlist contain the following proprieties:

- id - **string** - The UUID of the watchlist.
- context - **string** - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.
- name - **string** - The name of the watchlist.
- view - **string** - The default view for the watchlist.
- entries - **array** - The array of all symbols of the watchlist.
- preferences - **object** - The preferences object. It contains sorting and update mode options for the watchlist.
- preferences.sorting - **object** - The sorting options for the watchlist. It contains column and desc fields.
- preferences.sorting.column - **string** - The column used for sorting. The field should be absent if manual sorting is enabled.
- preferences.sorting.desc - **boolean** - The sorting direction. If value false - Ascending, if vallue true - Descending.
- preferences.updateMode - **string** - The data update mode.
- user - **string** - The user ID to which this watchlist belongs.
- system.sequence - **number** - Number of changes.
- system.timestamp - **number** - Last Modified Time.

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

### Operations

#### Create Watchlist

##### Overview

Creates a new watchlist.

The following parameters are required:

- name - **string** - The name of the watchlist.
- context - **string** - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.
- entries - **array** - The array of all symbols of the watchlist.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/>

##### Verb

POST

##### Body

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
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

##### Response

A JSON document will be returned which contains new watchlist.

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request POST <https://watchlist.aws.barchart.com/v1/watchlist> -H "Authorization: 'Bearer {JWT}'" -d '{"context":"TGAM","name":"Test","view":"main","entries":[{"symbol":"TSLA", "tgam_symbol":"TSLA-Q","notes":{}},{"symbol":"MSFT"}],"preferences":{"sorting":{"column":"symbol","desc":false}}}}'

#### Read Watchlist

##### Overview

Read all user watchlists.

The following parameters are required:

- context - **string** - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist?context={context}>

##### Verb

GET

##### Response

A JSON document will be returned which contains all user watchlists :

Here is an example:

```json
[
	{
		"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
		"context": "TGAM",
		"name": "Test",
		"view": "main",
		"entries": [
			{
				"symbol": "TSLA",
				"tgam_symbol": "TSLA-Q",
				"notes": {}
			},
			{
				"symbol": "MSFT"
			}
		],
		"preferences": {
			"sorting": {
				"column": "symbol",
				"desc": false
			}
		},
		"user": "113692067",
		"system": {
			"sequence": 1,
			"timestamp": 1580990379106
		}
	}
]
```

##### cURL example

> curl --request GET <https://watchlist.aws.barchart.com/v1/watchlist?context=TGAM> -H "Authorization: 'Bearer {JWT}'"

#### Edit Watchlist

##### Overview

Edit the watchlist.

The following parameters are required:

- name - **string** - The name of the watchlist.
- context - **string** - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.
- entries - **array** - The array of all symbols of the watchlist.

The following parameters are optional:

- view - **string** - The default view of the watchlist.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}>

##### Verb

PUT

##### Body

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	]
}
```

##### Response

A JSON document will be returned which contains edited watchlist :

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 2,
		"timestamp": 1581100339521
	}
}
```

##### cURL example

> curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21> -H "Authorization: 'Bearer {JWT}'" -d '{"context":"TGAM","name":"Test","view":"main","entries":[{"symbol":"TSLA","tgam_symbol":"TSLA-Q","notes":{}},{"symbol":"MSFT"}]}'

#### Delete Watchlist

##### Overview

Delete the watchlist.

The following parameters are required:

- watchlist - **string** - The UUID of the watchlist. Can be generated by UUID library.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}>

##### Verb

DELETE

##### Response

A JSON document will be returned which contains deleted watchlist :

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request DELETE <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21> -H "Authorization: 'Bearer {JWT}'"

#### Edit Preferences

##### Overview

Edit watchlist preferences.

Preferences contain the following proprieties:

- sorting - **object** - The sorting preferences.
- sorting.column - **string** - The column for sorting.
- sorting.desc - **boolean** - Sort Descending.
- updateMode - **string** - The data update mode.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}/preferences>

##### Verb

PUT

##### Body

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"sorting": {
		"desc": true
	},
	"updateMode": "eod"
}
```

##### Response

A JSON document will be returned which contains edited watchlist :

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSFT"
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}/preferences> -H "Authorization: 'Bearer {JWT}'" -d '{"sorting":{"desc":true},"updateMode":"eod"}'

#### Add Symbol

##### Overview

Add the symbol to the watchlist.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}/symbol>

##### Verb

PUT

##### Body

The following fields are required:

- symbol - **object** - The symbol object.

The following fields are optional:

- index - **number** - The index at which the symbol will be added. The symbol will be added to the end if the index doesn't provide.

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"symbol": {
		"symbol": "TSLA",
		"tgam_symbol": "TSLA-Q",
		"notes": {}
	},
	"index": 1
}
```

##### Response

A JSON document will be returned which contains watchlist with added symbol:

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21> -H "Authorization: 'Bearer {JWT}'" -d '{symbol:{"symbol":"TSLA","tgam_symbol":"TSLA-Q","notes":{}},"index":1}'

#### Delete Symbol

##### Overview

Delete the symbol from the watchlist.

The following parameters are required:

- watchlist - **string** - The UUID of the watchlist. Can be generated by UUID library.
- symbol - **string** - The symbol name.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}/symbol/{symbol}>

##### Verb

DELETE

##### Response

A JSON document will be returned which contains edited watchlist :

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request DELETE <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21/symbol/MSFT> -H "Authorization: 'Bearer {JWT}'"

#### Change Symbol Index

##### Overview

Move a symbol from index to another index

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist/{watchlist}/symbol/{symbol}>

##### Verb

PUT

##### Body

The following fields required:

- from - **number** - The index at which the symbol is located.
- to - **number** - The index at which the symbol will be moved.

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"from": 1,
	"to": 2
}
```

##### Response

A JSON document will be returned which contains watchlist with changes:

Here is an example:

```json
{
	"id": "81b2d6fa-bb7e-485b-8670-6d0c9330aa21",
	"context": "TGAM",
	"name": "Test",
	"view": "main",
	"entries": [
		{
			"symbol": "TSLA",
			"tgam_symbol": "TSLA-Q",
			"notes": {}
		},
		{
			"symbol": "MSQF",
			"tgam_symbol": "MSFT-Q",
			"notes": {}
		}
	],
	"preferences": {
		"sorting": {
			"column": "symbol",
			"desc": false
		}
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
	}
}
```

##### cURL example

> curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21/symbol/TSLA> -H "Authorization: 'Bearer {JWT}'" -d '{"from":2,"to":1}'
