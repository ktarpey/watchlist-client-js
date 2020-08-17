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
		loading() {
			return this.$store.loading;
		},
		selected() {
			return this.options.find(o => o.key === this.inputs.method) || null;
		}
	},
	data() {
		return {
			options: [
				{ key: 'readServiceMetadata', label: 'Read Service Metadata', method: () => this.$store.gateway.readServiceMetadata() },
				{ key: 'readWatchlists', label: 'Read Watchlists', method: () => this.$store.gateway.readWatchlists() },
				{ key: 'createWatchlist', label: 'Create Watchlist', method: () => this.$store.gateway.createWatchlist(generator.watchlistCreate()) },
				{ key: 'editWatchlist', label: 'Edit Watchlist', inputs: ['watchlistId'], method: ({ watchlistId }) => this.$store.gateway.editWatchlist(watchlistId, generator.watchlistEdit()) },
				{ key: 'deleteWatchlist', label: 'Delete Watchlist', inputs: ['watchlistId'], method: ({ watchlistId }) => this.$store.gateway.deleteWatchlist(watchlistId) },
				{ key: 'addSymbol', label: 'Add Symbol', inputs: ['watchlistId', 'symbol'], method: ({ watchlistId, symbol }) => this.$store.gateway.addSymbol(watchlistId, generator.entry(symbol)) },
				{ key: 'deleteSymbol', label: 'Delete Symbol', inputs: ['watchlistId', 'symbol'], method: ({ watchlistId, symbol }) => this.$store.gateway.deleteSymbol(watchlistId, symbol) },
				{ key: 'querySymbol', label: 'Query Symbol', inputs: ['symbol'], method: ({ symbol }) => this.$store.gateway.querySymbol(symbol) },
				{ key: 'editPreferences', label: 'Edit Preferences', inputs: ['watchlistId'], method: ({ watchlistId }) => this.$store.gateway.editPreferences(watchlistId, generator.preferences()) }
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

			this.$store.mutate.setLoading(true);

			this.selected.method(this.inputs)
				.then((response) => {
					this.response = response;

					this.$store.mutate.setLoading(false);
				}).catch((err) => {

					if (Array.isArray(err)) {
						this.response = err;
					} else {
						console.error(err);

						this.response = err.message;
					}

					this.$store.mutate.setLoading(false);
				});
		}
	}
};
