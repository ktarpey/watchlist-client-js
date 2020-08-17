## System Integration

As a consumer of the Barchart Watchlist Service, your software will:

* Create and curate watchlists

The Barchart Watchlist Service uses commercially reasonable procedures to ensure your data is safe. All data is encrypted before transmission (using HTTP over SSL/TLS). Furthermore, each interaction is authorized using a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).

## Token Generation

#### Authentication

Your system is responsible for authentication, for example:

* Perhaps users are identified by username and password.
* Perhaps users are identified using an SSO technology.
* Perhaps users are assumed to be valid because your software runs in a trusted environment.

Since your system _knows_ the user, it is _responsible for token generation_. The Barchart Watchlist Service will _decode_ your token and _verify_ its authenticity (using a shared secret).

#### Token Payload

The token payload must include the following claims:

```json
{
	"contextId": "picked-by-barchart",
	"userId": "picked-by-you"
}
```

A **context** is a container for users. In other words, your "context" is your organization. You can your "context" as follows:

```text
├── context
│   ├── user A
│   │   ├── watchlist 1
│   │   ├── watchlist 2
│   │   └── watchlist 3
│   ├── user B
│   │   └── watchlist 4
```

Your **context identifier** and **user identifiers** are always ```String``` values.

#### Token Signing Secrets

All tokens are _signed_ with shared secret using a specific algorithm. Each environment uses different algorithms and signing secrets.

**Test Environment:**

Here are the connection details:

* Hostname:```watchlist-test.aws.barchart.com```
* Port: ```443```
* Algorithm: ```HMAC-SHA256``` (aka ```HS256```)
* Secret: ```"public-knowledge-1234567890"```

Since the _test_ environment is intended for testing and evaluation purposes only, the _"secret"_ is intentionally publicized. Data saved in the _test_ environment can be viewed and manipulated by anyone. Use caution with any sensitive data.

**Production Environment:**

Here are the connection details:

* Hostname:```watchlist-prod.aws.barchart.com```
* Port: ```443```
* Algorithm: Agreed upon when your account is configured
* Secret: Agreed upon when your account is configured

When you're ready to move to production, you'll need to generate a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography). To generate new keys, use the following (with no passphrase):

```shell
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Once you're done, use the private key — called ```jwtRS256.key``` — to sign tokens and send the public key — called ```jwtRS256.key.pub``` — to Barchart.

**Contact us at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

#### Token Signing Example

Token signing should be done such that:

* The signing secret (e.g. private key or secret string) is not exposed.
* The signing system should be trusted to keep time correctly.
* The cryptography uses battle-tested code. This means you'll probably want to find a third-party library to help.

Here is an example written for Node.js using the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) library.

```js
const jwt = require('jsonwebtoken');

const claims = {
	userId: 'me',
	contextId: 'barchart'
};

const secret = 'public-knowledge-1234567890';
const token = jwt.sign(claims, secret, { algorithm: 'HS256', expiresIn: '2 days' });
```

## Token Usage

### Using the SDK

_SDK documentation will be added soon._

### Using the API

Each HTTP request must include a token. After you generate the token, add it to the ```Authorization``` header of your HTTP request. For example, here is the cURL command to get for all watchlists owned by ```me@barchart```:

```shell
curl 'https://watchlist-test.aws.barchart.com/v1/watchlists' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0SWQiOiJiYXJjaGFydCIsInVzZXJJZCI6Im1lIiwianRpIjoiOThjMjdjNmMtN2RlNS00MTQ4LTg4ZDgtNzgxN2M5M2E1OGE4IiwiaWF0IjoxNTk0MDcwNzgyLCJleHAiOjE1OTQwNzQzODJ9.Pm8O_SG-KBqj_BibPdKIwTIj4zmbIJ9v5MqJbqdgBfw'
```

If we decode the token — try [this tool](https://jwt.io/) — you'll see the token payload refers to ```me@barchart```:

```json
{
  "contextId": "barchart",
  "userId": "me",
  "jti": "98c27c6c-7de5-4148-88d8-7817c93a58a8",
  "iat": 1594070782,
  "exp": 1594074382
}
```

When using this token, we can only interact with watchlists owned by ```me@barchart```.

## Best Practices

Under no circumstances should your JWT secret be accessible to anyone outside of your organization. If someone obtains your signing secret, they could interact with the Barchart Watchlist Service on your behalf.

If you are developing a web application, you should not generate tokens inside the web browser. A clever user could read your JWT secret (from the web browser) and use it to impersonate other users.

Your secret should be protected. Tokens should only be generated by a trusted backend.

