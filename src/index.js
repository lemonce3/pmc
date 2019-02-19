const { addEventListener, Promise, postMessage } = require('./utils');
const Datagram = require('./diagram');
const { codes } = require('./status');
const PMCError = require('./error');

const DEFAULT_REQUEST_TIMEOUT = 30000;
const established = window.e = {};
const channelRegistry = window.c = {};

function resolveEstablished(id, response, statusCode) {
	const connection = established[id];

	if (connection) {
		const { resolve, reject, timeout, datagram } = connection;
	
		statusCode === 0 ?
			resolve(datagram.response) :
			reject(new PMCError(statusCode, response.context, datagram.channel, response.message));
	
		delete established[id];
		clearTimeout(timeout);
	}
}

addEventListener(window, 'message', function (event) {
	if (typeof event.data !== 'string') {
		return;
	}

	let dataObject;

	try {
		dataObject = JSON.parse(event.data);

		if (dataObject.protocol !== 'pmc') {
			return;
		} 
	} catch (error) {
		return;
	}

	const source = event.source;
	const { id, request, response, channel, status } = dataObject;
	
	if (status !== 1) {
		resolveEstablished(id, response, status);
	} else {
		const handler = channelRegistry[channel];
		const datagram = Datagram.from(dataObject);
	
		new Promise((resolve, reject) => {
			if (!handler) {
				reject({ code: 3, data: codes[3] });
			}

			try {
				resolve(handler(request, source));
			} catch (error) {
				reject({
					code: 128,
					data: {
						context: location.href,
						message: error.message || JSON.stringify(error),
					}
				});
			}
		}).then(function (data) {
			datagram.setResponse(data);
			datagram.setStatus(0);
		}, function ({ code, data }) {
			datagram.setResponse(data);
			datagram.setStatus(code);
		}).then(() => {
			postMessage(source, datagram.toJSON());
		});
	}
});

exports.on = function addChannel(name, handler) {
	channelRegistry[name] = handler;
};

exports.off = function removeChannel(name) {
	delete channelRegistry[name];
};

exports.request = function requestPMCServer(source, channel, data, {
	timeout = DEFAULT_REQUEST_TIMEOUT
} = {}) {
	const datagram = Datagram.create({ channel, request: data });
	const promise = new Promise((resolve, reject) => {
		const id = datagram.id;

		established[id] = {
			resolve, reject, datagram,
			timeout: setTimeout(() => {
				datagram.setStatus(4);
				delete established[id];
				reject(datagram);
			}, timeout)
		};
	});
	
	postMessage(source, datagram.toJSON());

	return promise;
};