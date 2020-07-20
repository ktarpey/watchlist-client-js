import Vue from 'vue';
import JsonViewer from 'vue-json-viewer';

import App from './components/App.vue';

Vue.use(JsonViewer);

const vue = new Vue({
	render: h => h(App),
}).$mount('#app');
