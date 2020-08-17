import Vue from 'vue';
import JsonViewer from 'vue-json-viewer';

import App from './components/App.vue';

import store from './store';

Vue.use(JsonViewer);

Vue.prototype.$store = store;

const vue = new Vue({
	data: {
		$$store: Vue.prototype.$store,
	},
	render: h => h(App)
}).$mount('#app');
