import fs from 'fs';

export default {
	eq: function (a, b) {
		return a === b;
	},
	fileExists: function (path) {
		return fs.existsSync(`views/${path}.hbs`);
	}
};
