const api = require('./api');

const logger = {
  log: console.log,
  clear: () => {},
  progress: console.log
};

const app = {
  require(moduleName, cb) {
    if (moduleName === 'java-ssl') {
      return cb(null, require('/home/volodymyr/.nvm/versions/node/v6.9.5/lib/node_modules/java-ssl'))
    } else {
      return require(modelName);
    }
  }
};

const testApplyToInstance = () => {
  const script = `CREATE KEYSPACE IF NOT EXISTS "hackolade_granted_keyspace" 
  WITH REPLICATION = {
    'class' : 'SimpleStrategy',
    'replication_factor' : 1
  }
AND DURABLE_WRITES = false; 

USE "hackolade_granted_keyspace";

CREATE TYPE IF NOT EXISTS "hackolade_granted_keyspace".hash_udt (
  "hash_table" frozen<map<text, text>>
);

CREATE TABLE IF NOT EXISTS "hackolade_granted_keyspace"."new_table" (
  "id" text,
  PRIMARY KEY ("id")
)
WITH caching = {"keys":'ALL','rows_per_partition':'NONE'};`;
  const connectionInfo = {
    "id": "28def800-08fd-11e9-8e7c-83d64ee19562",
    "name": "cassandra",
    "hosts": [{
      "host": "127.0.0.1",
      "port": "9042"
    }],
    "user": "cassandra",
    "password": "cassandra",
    "target": "CASSANDRA",
    script
  };

  api.applyToInstance(connectionInfo, {
    log: console.log,
    clear: () => {},
    progress: console.log
  }, (err, data) => {
    console.log(err, data);
  });
};

const testGettingData = () => {
  const data = {
    "collectionData": {
      "collections": {
        "hackolade_test_keyspace": [
          // "hash_table",
          // "json_table"
          "standard_types"
        ],
        "ksps_with_udt": [
          "my_table"
        ]
      },
      "dataBaseNames": [
        "ksps_with_udt"
      ]
    },
    "fieldInference": {
      "active": "field"
    },
    "includeEmptyCollection": false,
    "pagination": {
      "enabled": false,
      "value": 1000
    },
    "pluginPath": "/home/volodymyr/.hackolade/plugins/Cassandra",
    "recordSamplingSettings": {
      "absolute": {
        "value": 1000
      },
      "active": "absolute",
      "maxValue": 10000,
      "relative": {
        "value": "100"
      }
    },
    "target": "CASSANDRA",
    "hiddenKeys": [
      "options"
    ]
  };
  api.connect({
    hosts: [{ host: 'cassandra', port: '9042' }],
    user: 'cassandra',
    password: 'cassandra',
    ssl: 'jks',
    sslCaFile: '/home/volodymyr/projects/hackolade/test/reverse_engineering/databases/models/CASSANDRA/.docker/dse/certs/dse.cer.pem',
    sslCertFile: '/home/volodymyr/projects/hackolade/test/reverse_engineering/databases/models/CASSANDRA/.docker/dse/certs/dse.cer.pem',
    sslKeyFile: '/home/volodymyr/projects/hackolade/test/reverse_engineering/databases/models/CASSANDRA/.docker/dse/certs/dse.key.pem',

    keystore: '/home/volodymyr/projects/hackolade/test/reverse_engineering/databases/models/CASSANDRA/.docker/dse/certs/keystore.dse',
    keystorepass: 'cassandra',
    alias: 'cassandra'
  }, logger, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    api.getDbCollectionsNames(data, logger, (err, result) => {
      console.log(err, result);
    }, app);
    // api.getDbCollectionsData(data, logger, (err, result) => {
    //   console.log(JSON.stringify(result[0][0].validation.jsonSchema, null, 2));
    // });
  }, app);
};

testGettingData();
// testApplyToInstance();