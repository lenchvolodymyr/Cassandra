const fs = require('fs');

const readFile = (filePath) => new Promise((resolve, reject) => {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			return reject(err);
		} else {
			return resolve(data.toString());
		}
	});
});

const prepareError = (error) => ({
	message: error.message,
	stack: error.stack || (new Error()).stack
});

module.exports = {
	prepareError,
	readFile
};
