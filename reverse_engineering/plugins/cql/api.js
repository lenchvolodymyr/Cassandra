'use strict'

module.exports = {
	reFromFile(data, logger, callback) {
		logger.log('info', data, 'it works');
        callback(null, {});
    },
};