'use strict';
var path = require('path');
// eslint-disable-next-line no-unused-vars

require('dotenv').load({
    path: path.join(__dirname, '..', '.env'),
    silent: true
});
// // #!/usr/bin/env node
// /* eslint-disable no-console*/

require('epipebomb')();  // Allow piping to 'head'
const Storage = require('../src/server/storage/storage'),
    Logger = require('../src/server/logger'),
    Users = require('../src/server/storage/users'),
    logger = new Logger('netsblox:cli:add-user'),
    storage = new Storage(logger),
    Command = require('commander').Command,
    program = new Command();

program.arguments('<userName> <tokenID>');
program.parse(process.argv);

// List all the groups
const username = program.args[0];
const tokenID = program.args[1];

const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = process.env.MONGODB_PASS;
const MONGO_HOST = process.env.MONGODB_HOST;
const MONGO_PORT = process.env.MONGODB_PORT;
const MONGO_DBMS = process.env.MONGODB_DBMS;
const dbName = MONGO_DBMS;
console.log("Attempting to send token\n${tokenID}\nto User: ${username}");
console.log(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBMS}?authSource=admin`);

storage.connect()
    .then(() => Users.get(username))
    .then(user => {
        return user.recordTokenID(tokenID);
    })
    .then(() => storage.disconnect())
    .catch(err => {
        console.error(err);
        return storage.disconnect();
    });
// /* eslint-enable no-console*/

