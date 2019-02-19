const { codes } = require('./status');

module.exports = class PMCError extends Error {
	constructor(code, context, channel, message) {
		super(`${codes[code]} (${context})[${channel}]`);

		if (message) {
			this.message += ` => ${message}`;
		}

		this.name = 'PMCError';
	}
}