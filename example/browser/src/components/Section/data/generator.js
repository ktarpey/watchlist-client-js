const generateEntries = () => {
	const symbols = [ 'AAPL', 'TSLA', 'IBM', 'NTWK', 'IDE', 'HPS' ];

	const amount = Math.max(Math.floor(Math.random() * symbols.length), 1);

	const entries = [ ];

	for (let i = 0; i < amount; i++) {
		const available = symbols.filter(s => !entries.some(e => e.symbol === s));

		const entry = { };

		entry.symbol = available[Math.floor(Math.random() * available.length)];

		entries.push(entry);
	}

	return entries;
};

export default {
	watchlistCreate: () => ({
		name: `Randomly generated name ${Math.random().toString(36).substring(7)}`,
		entries: generateEntries()
	}),
	watchlistEdit: (watchlistId) => ({
		id: watchlistId,
		name: `Edited name ${Math.random().toString(36).substring(7)}`,
		entries: generateEntries()
	}),
	entry: symbol => ({ symbol: symbol }),
	preferences: () => ({
		column: `randomly-generated-column-${Math.random().toString(36).substring(7)}`,
		desc: Math.random() > 0.5
	})
};
