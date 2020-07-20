import Button from './../Button/Button.vue';
import SectionLoader from './../SectionLoader/SectionLoader.vue';

import generator from './data/generator';

export default {
	name: 'Section',
	components: {
		Button,
		SectionLoader
	},
	created() {
		this.inputs.method = this.options[0].key;
	},
	computed: {
		selected() {
			return this.options.find(o => o.key === this.inputs.method) || null;
		}
	},
	data() {
		return {
			loading: false,
			options: [
				{ key: 'readServiceMetadata', label: 'Read Service Metadata', method: () => window.Barchart.gateway.readServiceMetadata() },
				{ key: 'readWatchlists', label: 'Read Watchlists', method: () => window.Barchart.gateway.readWatchlists() },
				{ key: 'createWatchlist', label: 'Create Watchlist', method: () => window.Barchart.gateway.createWatchlist(generator.watchlistCreate()) },
				{ key: 'editWatchlist', label: 'Edit Watchlist', inputs: ['watchlistId'], method: ({ watchlistId }) => window.Barchart.gateway.editWatchlist(watchlistId, generator.watchlistEdit()) },
				{ key: 'deleteWatchlist', label: 'Delete Watchlist', inputs: ['watchlistId'], method: ({ watchlistId }) => window.Barchart.gateway.deleteWatchlist(watchlistId) },
				{ key: 'addSymbol', label: 'Add Symbol', inputs: ['watchlistId', 'symbol'], method: ({ watchlistId, symbol }) => window.Barchart.gateway.addSymbol(watchlistId, generator.entry(symbol)) },
				{ key: 'deleteSymbol', label: 'Delete Symbol', inputs: ['watchlistId', 'symbol'], method: ({ watchlistId, symbol }) => window.Barchart.gateway.deleteSymbol(watchlistId, symbol) },
				{ key: 'editPreferences', label: 'Edit Preferences', inputs: ['watchlistId'], method: ({ watchlistId }) => window.Barchart.gateway.editPreferences(watchlistId, generator.preferences()) }
			],
			response: null,
			inputs: {
				method: null,
				watchlistId: null,
				symbol: null
			}
		};
	},
	methods: {
		send() {
			if (!this.selected) {
				return;
			}

			this.loading = true;

			this.selected.method(this.inputs)
				.then((response) => {
					this.response = response;

					this.loading = false;
				}).catch((err) => {

					if (Array.isArray(err)) {
						this.response = err;
					} else {
						console.error(err);

						this.response = err.message;
					}

					this.loading = false;
				});
		}
	}
};
