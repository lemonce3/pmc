const utils = require('./utils');

const DEFAULT_REQUEST_TIMEOUT = 30000;
const established = {};
const channelRegistry = exports.channelRegistry = {};

function resolveEstablished(id, response, statusCode) {
	const connection = established[id];

	if (connection) {
		const { resolve, reject, timeout, datagram } = connection;
		
		statusCode === 0 ?
			resolve(response) :
			reject(utils.PMCError(statusCode, response.context, datagram.channel, response.message));
	
		delete established[id];
		clearTimeout(timeout);
	}
}

utils.addEventListener(window, 'message', function (event) {
	if (typeof event.data !== 'string') {
		return;
	}

	let datagram;

	try {
		datagram = JSON.parse(event.data);

		if (datagram.protocol !== 'pmc') {
			return;
		} 
	} catch (error) {
		return;
	}

	const source = event.source;
	const { id, request, response, channel, status } = datagram;
	
	if (status !== 1) {
		resolveEstablished(id, response, status);
	} else {
		const handler = channelRegistry[channel];
	
		new utils.Promise((resolve, reject) => {
			if (!handler) {
				datagram.status = 3;
				reject();
			}

			try {
				datagram.status = 0;
				resolve(handler(request, source));
			} catch (error) {
				datagram.status = 128;
				reject(error.message);
			}
		}).then(function (data) {
			datagram.response = data;
		}, function (message) {
			datagram.response = {
				context: location.href,
				message
			};
		}).then(() => {
			utils.postMessage(source, datagram);
		});
	}
});

exports.on = function addChannel(name, handler) {
	if (!utils.isFunction(handler)) {
		throw new Error('Handler should be a function.')
	}

	channelRegistry[name] = handler;
};

exports.off = function removeChannel(name) {
	delete channelRegistry[name];
};

exports.request = function requestPMCServer(source, channel, data, {
	timeout = DEFAULT_REQUEST_TIMEOUT
} = {}) {
	const datagram = utils.createDatagram({ channel, request: data });
	const promise = new utils.Promise((resolve, reject) => {
		const id = datagram.id;

		established[id] = {
			resolve, reject, datagram,
			timeout: setTimeout(() => {
				datagram.status = 4;
				delete established[id];
				reject(utils.PMCError(4, 'Unreachable', channel));
				console.error(source);
			}, timeout)
		};
	});
	
	utils.postMessage(source, datagram);

	return promise;
};