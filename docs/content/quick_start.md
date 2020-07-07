## Setup

As a consumer of the Barchart Watchlist Service, you have two options:

1. Connect and communicate with the backend _by embedding this SDK in your software_, or
2. Connect and communicate with the backend _by direct interaction with the REST interface_.

**If you choose to use the SDK**, you can install it from NPM (Node Package Manager), as follows:

```shell
npm install @barchart/watchlists-client-js -S
```

**Otherwise, if you choose not to use the SDK**, please finish reviewing this page, then refer to the [API Reference](/content/api) section.

## Environments

Two instances of the Barchart Watchlist Service are always running:

#### Demo

The _test_ environment can be used for integration and evaluation purposes. It can be accessed at ```watchlist-test.aws.barchart.com``` and has two significant limitations:

* data saved in the _test_ environment is purged nightly, and
* data saved in the _test_ environment can be accessed by anyone.

#### Production

The _production_ environment does not permit permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Authorization

[JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) — called JWT — are used for authorization. Each request made to the backend must include a token. Generating these tokens is surprisingly easy -- refer to the [Key Concepts: Security](/content/concepts/security) section for details.

In the _test_ environment, token generation follows these rules:

* All tokens are signed with the ```HMAC-SHA256``` (aka ```HS256```) algorithm
* All tokens are signed with the ```"public-knowledge-1234567890"``` secret

Since the signing secret is available to everyone, there can be no expectation of privacy; the _test_ environment is for testing and evaluation only.

In the the _production_ environment, you must exchange a _"secret"_  with Barchart — in the form of a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography). Consequently, your data will be secure.

Regardless of environment, the token payload uses two fields:

* ```userId``` is the unique identifier of the current user
* ```contextId``` is a unique identifier for your organization (use ````"BARCHART"``` in the _test_ environment).

## Connecting

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform an explicit "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT token in the _Authorization_ header of each request.

## Creating a Watchlist

First, we must construct an object which conforms to the ```Watchlist``` schema. Here is simple ```Watchlist``` object:

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

Once you've constructed a ```Watchlist``` object, you need to save it. The backend will assign an ```id``` and return a _complete_ ```Watchlist``` object to you.

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"name":"Notable Tech Stocks","entries":[{"symbol":"TSLA"},{"symbol":"AAPL"}]}'
```

The result will be a complete ```Watchlist``` object, similar to the example below. Obviously, the ```id``` value will differ for each watchlist created. However, we'll use this ```id``` value in subsequent examples.

```json
{
	"id":"227a251f-0e44-4ae8-991c-38701ba6afa9",
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

Once you've saved a watchlist, you can retrieve all watchlists (for the current user).

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw'
```

## Adding a Symbol

After a ```Watchlist``` has been saved, additional symbols can be added. Each symbol is wrapped in an ```Entry``` object. Here is an example:

```json
{
	"symbol": "CSCO"
}
```

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists/c1d036c9-6144-4451-91ee-68b9a1d215fb/symbols' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"index":0,"entry":{"symbol":"CSCO"}}'
```

## Removing a Symbol

After a ```Watchlist``` has been saved, you can remove symbols.

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell

```

## Deleting a Watchlist

If desired, a watchlist can be _permanently_ deleted.

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists/69a981d0-f966-413a-ac58-3d5dc74b6c4f' \
  -X 'DELETE' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw'
```