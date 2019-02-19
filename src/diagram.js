class Datagram {
	constructor({ id, channel, request, response, status }) {
		this.id = id;
		this.channel = channel;
		this.request = request;
		this.response = response;
		this.status = status;
	}

	setRequest(data) {
		return this.request = data;
	}

	setResponse(data) {
		return this.response = data;
	}

	setStatus(code) {
		if (typeof code !== 'number') {
			throw new Error('Status code MUST be a number.');
		}

		return this.status = code;
	}

	toJSON() {
		return {
			id: this.id,
			channel: this.channel,
			request: this.request,
			response: this.response,
			status: this.status,
			protocol: 'pmc'
		};
	}
}

let requestCounter = 0;

exports.create = function createDatagram({
	channel,
	id = requestCounter++,
	request = undefined,
	response = undefined,
	status = 1
}) {
	return new Datagram({ id, channel, status, request, response });
};

exports.from = function createDatagramFromObject({
	id, channel, status, request, response
}) {
	return new Datagram({ id, channel, status, request, response });
};