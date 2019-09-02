const getRegexp = (getName, getOptions) => {
	return `(CREATE\\s+KEYSPACE\\s+(IF\\s+NOT\\s+EXISTS\\s+)?${getName()})+${getOptions()};`;
};

const getNameRegexp = () => `(['"].+['"]|\\w+)`;

const getOptionsRegexp = () => `([\\s\\S]*?)`; 

const findAllKeyspaces = (schema) => {
	const expression = getRegexp(
		getNameRegexp,
		getOptionsRegexp
	);
	
	return schema.match(new RegExp(expression, 'gmi')) || [];
};

const removeQuotes = (str) => (str.match(/['"](.+)['"]/i) || [])[1] || str;

const getName = (keyspace) => {
	const parsedKeyspace = keyspace.match(new RegExp(getRegexp(getNameRegexp, getOptionsRegexp), 'i')) || '';
	const name = removeQuotes(parsedKeyspace[3] || '');

	return name;
};

const getReplicationObject = (replication) => {
	const replStrategy = replication.class;
	const replFactor = Number(replication.replication_factor) || '';

	if (replStrategy === 'NetworkTopologyStrategy') {
		const dataCenters = Object.keys(replication).reduce((dataCenters, keyName) => {
			if (['class', 'replication_factor'].includes(keyName)) {
				return dataCenters;
			}

			return dataCenters.concat({
				dataCenterName: keyName,
				replFactorValue: Number(replication[keyName]) || ''
			});
		}, []);

		return {
			replStrategy,
			dataCenters
		};
	} else {
		return {
			replStrategy,
			replFactor
		};
	}
};

const getReplication = (replicationText) => {
	const replicationMap = (replicationText.match(/\s*replication\s*=\s*(\{[\s\S]+\})/i) || [])[1] || '{}';
	const replicationJson = replicationMap.replace(/\'/g, '"');

	try {
		const data = JSON.parse(replicationJson);

		return data;
	} catch(e) {
		return {};
	}
};

const getDurableWrites = (durableWritesString) => {
	return /\s*durable_writes\s*=\s*(true)/i.test(durableWritesString);
};

const getOptions = (keyspace) => {
	const parsedKeyspace = keyspace.match(new RegExp(getRegexp(getNameRegexp, getOptionsRegexp), 'i')) || '';
	const options = parsedKeyspace[4] || '';
	const clearedOptions = options.replace(/\s*with\s*?/i, '').split('AND').map(item => item.trim());
	const optionsData = clearedOptions.reduce((result, item) => {
		if (/replication/i.test(item)) {
			return Object.assign({}, result, getReplicationObject(
				getReplication(item)
			));
		} else if (/durable_writes/i.test(item)) {
			return Object.assign({}, result, {
				durableWrites: getDurableWrites(item)
			});
		} else {
			return result;
		}
	}, {});

	return optionsData;
};

const parseKeyspace = (schema) => {
	return findAllKeyspaces(schema).map(keyspace => {
		const name = getName(keyspace);
		const options = getOptions(keyspace);

		return Object.assign({}, options, {
			name,
			code: name
		});
	});
};

module.exports = {
	parseKeyspace,
	findAllKeyspaces,
	getName,
	getOptions
};
