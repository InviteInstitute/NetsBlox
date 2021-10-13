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
    Projects = require('../src/server/storage/projects'),
    logger = new Logger('netsblox:cli:add-user'),
    storage = new Storage(logger),
    Command = require('commander').Command,
    program = new Command();

program.arguments('<owner> <projectName> <collaborator>');
program.parse(process.argv);


const owner = program.args[0]
const projectName = program.args[1]
const collaborator = program.args[2]



const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = process.env.MONGODB_PASS;
const MONGO_HOST = process.env.MONGODB_HOST;
const MONGO_PORT = process.env.MONGODB_PORT;
// logger.trace(`Attempting to send token\n${tokenID}\nto User: ${username}`);
// logger.trace(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBMS}?authSource=admin`);

function callThis(aa){
    var fs = require('fs');
    fs.writeFile('./testFile.txt', aa, function (err) {
    // fs.appendFile('./testFile.txt', aa+"\r\n");
    });
}

const owner = "test01"
const projectName = "p01_activity2"
const collaborator = "test01s1"

storage.connect()
    // .then(() => callThis(collaborator))
    .then(() =>{
        return Projects.addCollaborator(owner, projectName, collaborator)
    })
    .then(() => {
        let line = "Adding " + collaborator + " to " + owner + "'s " + projectName;
        logger.trace(line);
        storage.disconnect()
    })
    .catch(err => {
        let line = "=== Error Adding " + collaborator + " to " + owner + "'s " + projectName;
        logger.warn(line);
        console.error(err);
        return storage.disconnect();
    });
// /* eslint-enable no-console*/

