# API Reference

## Watchlist API 3.0.12 {docsify-ignore}
    
> Watchlist API

## OpenAPI Definition {docsify-ignore}

[Download](static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)
* [Try Me](#tryme)

## Servers {docsify-ignore}

* [https://watchlist-test.aws.barchart.com/v1](https://watchlist-test.aws.barchart.com/v1)  - Hostname for test environment.
* [https://watchlist.aws.barchart.com/v1](https://watchlist.aws.barchart.com/v1)  - Hostname for production environment.

## Components {docsify-ignore}

### Responses 

* [Unauthorized](/content/api/components?id=responsesUnauthorized)

### Schemas 

* [watchlist](/content/api/components?id=schemaswatchlist)
* [preferences](/content/api/components?id=schemaspreferences)
* [system](/content/api/components?id=schemassystem)
* [entries](/content/api/components?id=schemasentries)
* [symbol](/content/api/components?id=schemassymbol)

### Security 

* [JWT](/content/api/components?id=securityJWT)

## Paths {docsify-ignore}

* [GET /watchlists](/content/api/paths?id=get-watchlists)
* [POST /watchlists](/content/api/paths?id=post-watchlists)
* [DELETE /watchlists/{watchlist}](/content/api/paths?id=delete-watchlistswatchlist)
* [PUT /watchlists/{watchlist}](/content/api/paths?id=put-watchlistswatchlist)
* [PUT /watchlists/{watchlist}/preferences](/content/api/paths?id=put-watchlistswatchlistpreferences)
* [PUT /watchlists/{watchlist}/symbols](/content/api/paths?id=put-watchlistswatchlistsymbols)
* [DELETE /watchlists/{watchlist}/symbols/{symbol}](/content/api/paths?id=delete-watchlistswatchlistsymbolssymbol)
* [PUT /watchlists/{watchlist}/symbols/{symbol}](/content/api/paths?id=put-watchlistswatchlistsymbolssymbol)

## Try Me :id=tryme {docsify-ignore}

**Try Me** page allows anyone to interact with the API’s resources without having any of the implementation logic in place. It’s automatically generated from a OpenAPI Specification, with the visual documentation making it easy for back end implementation and client side consumption.

> You can test the API by following link: [Try Me](content/api/try)
