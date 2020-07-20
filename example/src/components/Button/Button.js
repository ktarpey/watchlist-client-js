export default {
	name: 'Button',
	props: {
		disabled: {
			required: false,
			type: Boolean,
		},
		text: {
			required: true,
			type: String,
		},
		action: {
			required: true,
			type: Function,
			default: () => { },
		},
		active: {
			required: false,
			type: Boolean,
		},
		theme: {
			required: false,
			type: String,
			default: 'Light',
			validator: (value) => {
				return ['Light', 'Dark'].indexOf(value) !== -1;
			}
		},
	}
};
