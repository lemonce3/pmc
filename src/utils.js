
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

let requestCounter = 0;

exports.createDatagram = function createDatagram({
	channel,
	id = requestCounter++,
	request = undefined,
	response = undefined,
	status = 1
}) {
	return { id, channel, status, request, response,
		protocol: 'pmc'
	};
};

const codes = {
	'0': 'OK',
	'1': 'Connecting',
	'3': 'Channel not registered',
	'4': 'Timeout',
	'128': 'Internal error'
};

exports.PMCError = function PMCError(code, context, channel, message) {
	const error = new Error(`${codes[code]} (${context})[${channel}]`);

	if (message) {
		error.message += ` => ${message}`;
	}

	error.name = 'PMCError';

	return error;
}

exports.isFunction = function (value) {
	return typeof value === 'function';
}