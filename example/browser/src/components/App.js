import Header from './Header/Header.vue';
import SectionLoader from './SectionLoader/SectionLoader.vue';
import Section from './Section/Section.vue';
import Footer from './Footer/Footer.vue';

import WatchlistGateway from './../../../../lib/gateway/WatchlistGateway';
import JwtProvider from './../../../../lib/security/JwtProvider';

export default {
	components: {
		Header,
		SectionLoader,
		Section,
		Footer
	},
	created() {
		window.Barchart = { };

		WatchlistGateway.forTest(JwtProvider.forTest('me', 'BARCHART'))
			.then((gateway) => {
				window.Barchart.gateway = gateway;

				this.loading = false;
			});
	},
	data() {
		return {
			loading: true
		};
	}
};
