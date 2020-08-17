import packageJson from './../../../../../package.json';

export default {
	name: 'Footer',
	created() {
		this.$store.mutate.setLoading(true);

		this.$store.gateway.readServiceMetadata()
			.then((metadata) => {
				this.versions.api = metadata.server.semver;
				this.environment = metadata.server.environment;
				this.user = metadata.user.id;
				this.context = metadata.context.id;

				this.$store.mutate.setLoading(false);
			}).catch((err) => {
				console.error(err);

				this.$store.mutate.setLoading(false);
			});
	},
	computed: {
		me() {
			return `User: ${this.user || '-'}.${this.context || '-'}`;
		},
		metadata() {
			return `Version: ui.${this.versions.ui}.api.${this.versions.api || '-'}.${this.environment || '-'}`;
		}
	},
	data() {
		return {
			user: null,
			context: null,
			environment: null,
			versions: {
				ui: packageJson.version,
				api: null
			}
		};
	}
};
