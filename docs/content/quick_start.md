## Setup

As a consumer of the Barchart Watchlist Service, you have two options for backend connection and communication:

1. _by embedding this SDK in your software_, or
2. _by direct interaction with the REST API_.

**If you choose to use the SDK**, you can install it from NPM (Node Package Manager), as follows:

```shell
npm install @barchart/watchlists-client-js -S
```

**If you choose not to use the SDK**, please finish reviewing this page, then refer to the [API Reference](/content/api_reference) section.

## Environments

Two instances of the Barchart Watchlist Service are always running:

#### Demo

The _test_ environment can be used for integration and evaluation purposes. It can be accessed at ```watchlist-test.aws.barchart.com``` and has two significant limitations:

* data saved in the _test_ environment is purged nightly, and
* data saved in the _test_ environment can be accessed by anyone.

#### Production

The _production_ environment does not permit permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Authorization

[JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) — called JWT — are used for authorization. Each request made to the backend must include a token. Generating these tokens is surprisingly easy — refer to the [Key Concepts: Security](/content/concepts/security) section for details.

In the _test_ environment, token generation uses these parameters:

* Tokens are signed with the ```HMAC-SHA256``` (aka ```HS256```) algorithm
* Tokens are signed with the following secret: ```"public-knowledge-1234567890"```

The _test_ environment is intended for evaluation and testing purposes. Since the signing secret has been publicized (above), there can be no expectation of privacy. Consequently, no sensitive information should be saved in the _test_ environment.

The _production_ environment is secure. You will generate a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography) and provide the public certificate to Barchart. As long as you maintain control over your private certificate, your data will be protected.

Regardless of environment, the token payload must include two claims:

* ```userId``` is the unique identifier of the current user
* ```contextId``` is a unique identifier for your organization (use ```"barchart"``` in the _test_ environment).

## Connecting

#### Using the SDK

Before you can do anything meaningful with the SDK, you must obtain an instance of the ```WatchlistGateway``` class. Use one of the static factory functions and provide a strategy for generating JSON Web Tokens, as follows:

```js
const WatchlistGateway = require('@barchart/watchlist-client-js/lib/gateway/WatchlistGateway'),
	JwtProvider = require('@barchart/watchlist-client-js/lib/security/JwtProvider');

const myUserId = 'me';
const myContextId = 'barchart';

WatchlistGateway.forTest(JwtProvider.forTest(myUserId, myContextId))
	.then((watchlistGateway) => {
		// ready ...
	});
```

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform an explicit "connect" action. Each HTTP request is independently authorized by the backend. A JWT token is required in the _Authorization_ header of each request.

## Constructing a Watchlist

First, construct an object which conforms to the [```Watchlist```](content/sdk/lib-data?id=schemawatchlist) schema. Here is a simple example:

```json
{
	"name": "Notable Tech Stocks",
	"entries": [
		{
			"symbol": "TSLA"
		},
		{
			"symbol": "AAPL"
		}
	]
}
```

## Saving a Watchlist

Once you've constructed a ```Watchlist``` object, you need to save it. The backend will assign ```id```, ```user```, and ```context``` property values and return the _completed_ ```Watchlist``` object to you.

#### Using the SDK

```js
const watchlist = {
	name: 'Notable Tech Stocks',
	entries: [
		{ symbol: 'TSLA' },
		{ symbol: 'AAPL' }
	]
};

watchlistGateway.createWatchlist(watchlist)
	.then((created) => {
		console.log(`Watchlist created with identifier [ ${created.id} ]`);
	});
```

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"name":"Notable Tech Stocks","entries":[{"symbol":"TSLA"},{"symbol":"AAPL"}]}'
```

#### Example Output

The result will be a complete ```Watchlist``` object, similar to the example below. The ```id``` value will differ for each watchlist created. This ```id``` value will be used in subsequent examples.

```json
{
	"id":"425803d2-a98a-4ee3-95b8-08071510ed0b",
	"name":"Notable Tech Stocks",
	"user":"me",
	"context":"BARCHART",
	"entries":[
		{
			"symbol":"TSLA"
		},
		{
			"symbol":"AAPL"
		}
	],
	"system":{
		"sequence":1,
		"timestamp":1594144716779
	}
}
```

## Retrieving Your Watchlists

Retrieve all watchlists (for the current user), as follows:

#### Using the SDK

```js
watchlistGateway.readWatchlists()
	.then((watchlists) => {
		console.log(`You have [ ${watchlists.length} ] watchlist(s)`);
	});
```

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw'
```

## Adding a Symbol

After a ```Watchlist``` has been saved, additional symbols can be added. Each symbol is wrapped in a [```WatchlistEntry```](content/sdk/lib-data?id=schemawatchlistentry) object. Here is the simplest example:

```json
{
	"symbol": "CSCO"
}
```

You can add additional properties to any ```WatchlistEntry``` object as necessary. However, only ```String```, ```Number```, or ```Boolean``` values are permitted.

#### Using the SDK

```js
const entry = {
	symbol: 'CSCO'
};

watchlistGateway.addSymbol(watchlist.id, entry)
	.then((updated) => {
		console.log(`Watchlist [ ${updated.id} ] now as [ ${updated.entries.length} ] entries`);
	});
```

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists/425803d2-a98a-4ee3-95b8-08071510ed0b/symbols' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"index":0,"entry":{"symbol":"CSCO"}}'
```

## Removing a Symbol

After a ```Watchlist``` has been saved, you can remove symbols.

#### Using the SDK

```js
const symbol = 'CSCO';

watchlistGateway.deleteSymbol(watchlist.id, symbol)
	.then((updated) => {
		console.log(`Watchlist [ ${updated.id} ] now as [ ${updated.entries.length} ] entries`);
	});
```

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists/425803d2-a98a-4ee3-95b8-08071510ed0b/symbols/CSCO' \
  -X 'DELETE' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw' \
  -H 'Content-Type: application/json;charset=UTF-8'
```

## Deleting a Watchlist

If desired, a watchlist can be _permanently_ deleted.

#### Using the SDK

```js
watchlistGateway.deleteWatchlist(watchlist.id)
	.then(() => {
		console.log(`Watchlist [ ${watchlist.id} ] was deleted.`);
	});
```

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists/425803d2-a98a-4ee3-95b8-08071510ed0b' \
  -X 'DELETE' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw'
```

## Sample Applications

Two sample applications were built with the SDK to provide insight into features and usage.  

### Web Application

A single-page HTML application connects to the _test_ environment. It allows you to invoke watchlist operations (e.g. create a watchlist, add a symbol, etc).

Run the application by opening ```example/browser/index.html``` in any modern web browser.

### Node.js

A simple Node.js script connects to the _test_ environment, retrieves a list of watchlists, and creates a new watchlist. Run the script from a command prompt, as follows:

```shell
npm install
node ./example/node/example.js {user_id}
```

