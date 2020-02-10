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

### Operations

#### Create Watchlist

##### Overview

Creates a new watchlist.

The following parameters are required:

- name - __string__ - The name of the watchlist.
- context - __string__ - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.
- entries - __array__ - The array of all symbols of the watchlist.

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

A JSON document will be returned which contains new watchlist :

- system.sequence - __number__ - Number of changes.
- system.timestamp - __number__ - Last Modified Time.

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
		},
	},
	"user": "113692067",
	"system": {
		"sequence": 1,
		"timestamp": 1580990379106
		}
}
```

##### cURL example

 > curl --request POST <https://watchlist.aws.barchart.com/v1/watchlist> -H "Authorization: 'Bearer {JWT}'" -d '{"id":"81b2d6fa-bb7e-485b-8670-6d0c9330cc35", "context":"TGAM","name":"Test","view":"main","entries":[{"symbol":"TSLA", "tgam_symbol":"TSLA-Q","notes":{}},{"symbol":"MSFT"}],"preferences":{"sorting":{"column":"symbol","desc":false}}}}'

#### Read Watchlist

##### Overview

Read all user watchlists.

The following parameters are required:

- context - __string__ - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.

##### Endpoint

<https://watchlist.aws.barchart.com/v1/watchlist?context={context}>

##### Verb

GET

##### Response

A JSON document will be returned which contains all user watchlists :

Here is an example:

```json
[{
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
}]
```

##### cURL example

 > curl --request GET <https://watchlist.aws.barchart.com/v1/watchlist?context=TGAM> -H "Authorization: 'Bearer {JWT}'"

#### Edit Watchlist

##### Overview

Edit the watchlist.

The following parameters are required:

- user - __string__ - The ID of user.
- name - __string__ - The name of the watchlist.
- context - __string__ - The company shortcut code. Example: (TGAM, BARCHART). Barchart can provide your context name.
- entries - __array__ - The array of all symbols of the watchlist.
- system.sequence - __number__ - The number of changes.

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
	],
	"preferences":{
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
	"preferences":{
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

 > curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21> -H "Authorization: 'Bearer {JWT}'" -d '{"id":"81b2d6fa-bb7e-485b-8670-6d0c9330aa21","context":"TGAM","name":"Test","view":"main","entries":[{"symbol":"TSLA","tgam_symbol":"TSLA-Q","notes":{}},{"symbol":"MSFT"}],"preferences":{"sorting":{"column":"symbol","desc":false}},"user":"113692067","system":{"sequence": 1,"timestamp":1580990379106}}'

#### Delete Watchlist

##### Overview

Delete the watchlist.

The following parameters are required:

- watchlist - __string__ - The UUID of the watchlist. Can be generated by UUID library.

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
	"preferences":{
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

- sorting - __object__ - The sorting preferences.
- sorting.column - __string__ - The column for sorting.
- sorting.desc - __boolean__ - Sort Descending.
- updateMode - __string__  - The data update mode.

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
		},			{
			"symbol": "MSFT"
		}
	],
	"preferences":{
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

The request body should be a "stringified" JSON document. Here is an example document:

```json
{
	"symbol": "TSLA",
	"tgam_symbol": "TSLA-Q",
	"notes": {}
}
```

##### Response

A JSON document will be returned which contains watchlist with added symbol :

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
	"preferences":{
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

 > curl --request PUT <https://watchlist.aws.barchart.com/v1/watchlist/81b2d6fa-bb7e-485b-8670-6d0c9330aa21> -H "Authorization: 'Bearer {JWT}'" -d '{"symbol":"TSLA","tgam_symbol":"TSLA-Q","notes":{}}'

#### Delete Symbol

##### Overview

Add the symbol from the watchlist.

The following parameters are required:

- watchlist - __string__ - The UUID of the watchlist. Can be generated by UUID library.
- symbol - __string__ - The symbol name.

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
	"preferences":{
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
