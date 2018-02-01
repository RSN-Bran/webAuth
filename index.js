'use strict';

const DB_URL = 'mongodb://localhost:27017/users';

const mongo = require('mongodb').MongoClient;

const options = require('./options').options;
const server = require('./server/server');

mongo.connect(DB_URL).
  //then((db) => users.initUsers(db)).
  then(function(db) {
    server.serve(options);
    //db.close(); no simple way to shutdown express.js; hence ^C to shutdown
  }).
  catch((e) => console.error(e));

