const cassandra = require('cassandra-driver');
var state = {
	client: null
};

const connect = (info) => {
	if (!state.client) {
		const username = info.user;
		const password = info.password;
		const authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
		const contactPoints = info.hosts.map(item => `${item.host}:${item.port}`);
		state.client = new cassandra.Client({ contactPoints, authProvider });
	}
	
	return state.client.connect();
};

const close = () => {
	if (state.client) {
		state.client = null;
	}
};

const getKeyspaces = () => {
	return Object.keys(state.client.metadata.keyspaces);
};

const prepareConnectionDataItem = (keyspace, tables) => {
	let connectionDataItem = {
		dbName: keyspace,
		dbCollections: tables
	};

	return connectionDataItem;
};

module.exports = {
	connect,
	close,
	getKeyspaces,
	prepareConnectionDataItem
};
