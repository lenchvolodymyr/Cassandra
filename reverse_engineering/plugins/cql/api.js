'use strict'

const {
	readFile,
	prepareError
} = require('./utils/index');
const parseKeyspace = require('./helpers/parseKeyspace').parseKeyspace;

module.exports = {
	reFromFile(data, logger, callback) {
		logger.log('info', 'Start parsing CQL schema...', 'CQL File');
		
		readFile(data.filePath)
			.then((schema) => {
				const keyspaces = parseKeyspace(schema);

				callback(null, keyspaces);
			})
			.catch(error => {
				callback(prepareError(error));
			});
    },
};
