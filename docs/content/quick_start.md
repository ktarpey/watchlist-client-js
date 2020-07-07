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
* ```contextId``` is a unique identifier for your organization (use "barchart" in the _test_ environment).

## Connecting

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform an explicit "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT token in the _Authorization_ header of each request.

## Creating a Watchlist

First, we must construct an object which conforms to the ```Watchlist``` schema. Here is simple ```Watchlist``` object:

```json

```

## Saving a Watchlist

Assuming we've defined an watchlist (see above), the first thing we need to do is save it. The backend will assign an ```id``` and return a _complete_ ```Watchlist``` object to you.

#### Using the SDK

_SDK documentation will be added soon._

#### Using the API

```shell

```

## Adding a Symbol

After a ```Watchlist``` has been saved, additional symbols can be added.

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

```