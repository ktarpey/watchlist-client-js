const mutations = {
	setAuthorized(authorized) {
		state.authorized = authorized;
	},
	setGateway(gateway) {
		state.gateway = gateway;
	},
	setLoading(loading) {
		state.loading = loading;
	}
};

function getInitialState() {
	return {
		authorized: false,
		gateway: null,
		loading: false,

		mutate: mutations
	};
}

const state = Object.assign({ }, getInitialState());

export default state;
