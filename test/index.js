require('js-polyfills/polyfill.min');
require('js-polyfills/web.min');
require('js-polyfills/typedarray');
require('mocha/mocha.css');
require('./test.css');
require('mocha/mocha');
// require('babel-polyfill');
const utils = require('../src/utils');
const {on, request} = require('../src/index');

if (window.top === window.self) {
	mocha.setup('bdd');
	mocha.timeout(40000);

	require('./unit');

	utils.addEventListener(window, 'load', function () {
		mocha.run();
	});

	window.f = [];

	function init(request, source) {
		f.push(source);
	}

	on('frame.init', init);
} else {
	require('./frame-channel');

	request(top, 'frame.init');
}
