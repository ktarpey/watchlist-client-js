import WatchlistGateway from './../../../../../lib/gateway/WatchlistGateway';
import JwtProvider from './../../../../../lib/security/JwtProvider';

export default {
	name: 'Login',
	beforeMount() {
		this.contexts = [
			'BARCHART',
			'CUSTOM'
		];

		this.contextType = this.contexts[0];
		this.userId = '00000000';
	},
	data: function() {
		return {
			contextId: null,
			contextType: null,
			userId: null
		};
	},
	methods: {
		connect() {
			let contextId;

			if (this.contextType === 'CUSTOM') {
				contextId = this.contextId;
			} else {
				contextId = this.contextType;
			}

			if (!contextId || !this.userId) {
				return;
			}

			WatchlistGateway.forTest(JwtProvider.forTest(this.userId, contextId))
				.then((gateway) => {
					this.$store.mutate.setGateway(gateway);
					this.$store.mutate.setAuthorized(true);
				});
		}
	}
};

