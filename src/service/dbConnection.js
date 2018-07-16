const models = require('express-cassandra');
const debug = require('debug')('app-DbConnection');
const path = require('path');

// Tell express-cassandra to use the models-directory, and
// use bind() to load the models using cassandra configurations.
models.setDirectory(path.join(__dirname, '/src/models')).bind(
  {
    clientOptions: {
      contactPoints: ['127.0.0.1'],
      protocolOptions: { port: 9042 },
      keyspace: 'mykeyspace',
      queryOptions: { consistency: models.consistencies.one }
    },
    ormOptions: {
      // If your keyspace doesn't exist it will be created automatically
      // using the default replication strategy provided here.
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      createKeyspace: true
    }
  },
  (err) => {
    if (err) debug(err.message);
    else debug(models.timeuuid());
  }
);

module.exports = models;
