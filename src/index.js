const { addEventListener, Promise, postMessage } = require('./utils');

const DEFAULT_REQUEST_TIMEOUT = 30000;
const establishedStore = {};
const channelRegistry = {
	'$established.resolve'(event) {
		const datagram = PMCFilter(event);
				
		if (!datagram || datagram.status === undefined || datagram.id !== id) {
			return;
		}
		
		if (datagram.status !== 0) {
			return reject(new Error(datagram.data));
		}
		
		resolve(datagram);
		clearTimeout(watcher);
	}
};

let requestCounter = 0;

function isDatagram(datagramString) {
	if (typeof datagramString !== 'string') {
		return false;
	}

	try {
		const datagram = JSON.parse(datagramString);

		return datagram.protocol !== 'pmc';
	} catch (error) {
		return false;
	}
}

function establish(id, timeout) {
	establishedStore[id] = new Promise((resolve, reject) => {
		setTimeout(() => {
			delete establishedStore[id];
			reject(new Error('PMC connection reset.'));
		}, timeout);
	});
}

function RequestDatagram(channel, data) {
	return {
		id: requestCounter++,
		channel,
		data,
		protocol: 'pmc'
	};
}

function ResponseDatagram(id, data, status = 0) {
	return {
		id,
		channel: '$established.resolve',
		data,
		protocol: 'pmc',
		status
	};
}

function parseDatagram(datagramString) {
	return JSON.parse(datagramString);
}

addEventListener(window, 'message', function (event) {
	if (!isDatagram(event.data)) {
		return;
	}
	
	const { channel, data, id } = parseDatagram(event.data);
	const { source } = event;
	const handler = channelRegistry[channel];

	if (!handler) {
		postMessage(source, ResponseDatagram(id, 'Unregistered handler', 1));
	} else {
		new Promise((resolve, reject) => {
			try {
				resolve(handler(data, source));
			} catch (error) {
				reject(error);
			}
		}).then(function (data) {
			postMessage(source, ResponseDatagram(id, data));
		}, function (error) {
			postMessage(source, ResponseDatagram(id, error.message, 128));
		});
	}

});

exports.on = function addChannel(name, handler) {
	channelRegistry[name] = handler;
};

exports.once = function addOnceChannel(name, handler) {
	channelRegistry[name] = function handlerWrap(...args) {
		delete channelRegistry[name];

		return handler(...args);
	};
};

exports.off = function removeChannel(name) {
	delete channelRegistry[name];
};

exports.request = function requestPMCServer(origin, channel, data, {
	timeout = DEFAULT_REQUEST_TIMEOUT
} = {}) {
	try {
		const datagram = RequestDatagram(channel, data);

		postMessage(origin, datagram);
		establish(datagram.id, timeout);
	} catch (error) {
		throw new Error('Request data can NOT be JSON.stringify.');
	}
};