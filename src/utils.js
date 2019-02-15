
exports.addEventListener = function (element, eventType, listener) {
	if (element.addEventListener) {
		element.addEventListener(eventType, listener, false);
	} else {
		element.attachEvent(`on${eventType}`, listener);
	}
};

exports.postMessage = function postMessage(source, datagram) {
	const datagramString = JSON.stringify(datagram);

	setTimeout(() => source.postMessage(datagramString, '*'), 0);
};

exports.Promise = window.Promise || require('promise-polyfill/lib');