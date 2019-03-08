require('js-polyfills/polyfill.min');
require('js-polyfills/web.min');
require('js-polyfills/typedarray');
require('mocha/mocha.css');
require('./test.css');
require('mocha/mocha');

const utils = require('../src/utils');

if (window.top === window.self) {
	mocha.setup('bdd');
	mocha.timeout(40000);

	require('./unit');

	utils.addEventListener(window, 'load', function () {
		mocha.run();
	});

} else {
	require('./frame-channel');
}
