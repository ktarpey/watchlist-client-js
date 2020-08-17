import Button from './../Button/Button.vue';

export default {
	name: 'Header',
	components: {
		Button
	},
	methods: {
		disconnect() {
			this.$store.mutate.setGateway(null);
			this.$store.mutate.setAuthorized(false);
		}
	}
};
