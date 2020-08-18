## Synopsis

The Barchart Watchlist Service communicates using [JSON](https://en.wikipedia.org/wiki/JSON) data. You send JSON-formatted objects to the backend. You receive JSON-formatted in response. **This section describes the schema for these JSON objects.**

Here is the object graph for a watchlist:

```text
├── Watchlist
│   ├── WatchlistEntries
│   │   ├── WatchlistEntry (1)
│   │   ├── WatchlistEntry (2)
│   │   └── WatchlistEntry (n)
│   └── WatchlistPreferences
```

## Watchlist

Here is the formal definition of a watchlist:

* [```Schema.Watchlist```](/content/sdk/lib-data?id=schemawatchlist)

When creating a new watchlist, you'll need two properties:

* ```name```
* ```entries```

Other properties are assigned and managed by the backend:

* ```id```
* ```user```
* ```context```

## Watchlist Entries

Here is the formal definition of a watchlist entry, representing a single instrument:

* [```Schema.WatchlistEntry```](/content/sdk/lib-data?id=schemawatchlistentry)

Each watchlist entry must have a ```symbol``` property.

Additional ad hoc properties are allowed. Property values must be either ```String``` or ```Number``` types. Here is an example, where ```target``` and ```notes``` are ad hoc properties.

```json
{
	"symbol": "TSLA",
	"target": 2500,
	"notes": "https://www.youtube.com/watch?v=4BPU5mKipNo"
}
```

## Watchlist Preferences

Here is the formal definition of a watchlist prefernces:

* [```Schema.WatchlistPreference```](/content/sdk/lib-data?id=schemawatchlistpreferences)


## Examples

#### Simple

Here is simple example — the minimum required to create a new watchlist:

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

#### Complex

Here a more example — which makes use of ad hoc properties in the entries and preferences:

```json
{
	"name": "Notable Tech Stocks",
	"entries": [
		{
			"symbol": "TSLA",
			"target": 2500,
			"notes": "https://www.youtube.com/watch?v=4BPU5mKipNo"
		},
		{
			"symbol": "AAPL",
			"target": 600,
			"notes": "https://www.youtube.com/watch?v=r5WLXZspD1M"
		}
	]
}
```








