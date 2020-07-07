# API Reference

## Watchlist API 4.0.0 {docsify-ignore}
    
> Watchlist API

## OpenAPI Definition {docsify-ignore}

[Download](static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)


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
* [entry](/content/api/components?id=schemasentry)

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
