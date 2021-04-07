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
// console.log(`Attempting to send token\n${tokenID}\nto User: ${username}`);
// console.log(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBMS}?authSource=admin`);

function callThis(user, token){
    var fs = require('fs');
    fs.writeFile('./a3.txt', (new Date())+"\r\n", function (err) {
    fs.appendFile('./a3.txt', username+"\r\n");
    fs.appendFile('./a3.txt', tokenID+"\r\n");
    fs.appendFile('./a3.txt', path.join(__dirname, '..', '.env')+"\r\n");
    fs.appendFile('./a3.txt', MONGO_USER+"\r\n");
    fs.appendFile('./a3.txt', MONGO_PASS+"\r\n");
    fs.appendFile('./a3.txt', MONGO_HOST+"\r\n");
    fs.appendFile('./a3.txt', MONGO_PORT+"\r\n");
    fs.appendFile('./a3.txt', MONGO_DBMS+"\r\n");
    });
}

storage.connect()
    .then(() => Users.get(username))
    .then(user => {
        //callThis(username, tokenID);
        return user.recordTokenID(tokenID);
    })
    .then(() => storage.disconnect())
    .catch(err => {
        console.error(err);
        return storage.disconnect();
    });
// /* eslint-enable no-console*/

