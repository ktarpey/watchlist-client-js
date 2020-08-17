import Footer from './Footer/Footer.vue';
import Header from './Header/Header.vue';
import Login from './Login/Login.vue';
import Section from './Section/Section.vue';
import SectionLoader from './SectionLoader/SectionLoader.vue';

export default {
	components: {
		Footer,
		Header,
		Login,
		Section,
		SectionLoader
	},
	computed: {
		authorized() {
			return this.$store.authorized;
		}
	}
};
