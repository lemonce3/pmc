require('js-polyfills/polyfill.min');
require('js-polyfills/web.min');
require('js-polyfills/typedarray');
require('mocha/mocha.css');
require('./test.css');
require('mocha/mocha');
// require('babel-polyfill');
const utils = require('../src/utils');

console.error = function (msg) {
	console.log(msg, 1)
}

if (window.top === window.self) {
	utils.addEventListener(window, 'load', function () {
		mocha.setup('bdd');

		describe('mocha test', function () {
			console.log('ok');

			it('pendding case', function () {
				return true;
			});
		});
	
		mocha.run();
	});
}
