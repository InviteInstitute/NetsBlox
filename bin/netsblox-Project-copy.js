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

program.arguments('<copyProjectFrom> <projectToBeCopied> <saveTo> <newProjectName>');
program.parse(process.argv);


const copyProjectFrom = program.args[0]
const projectToBeCopied = program.args[1]
const saveTo = program.args[2]
const newProjectName = program.args[3]


// const copyProjectFrom = "g01"
// const projectToBeCopied = "g01_activity1"
// const saveTo = "y01"
// const newProjectName = "coolProject1"


const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = process.env.MONGODB_PASS;
const MONGO_HOST = process.env.MONGODB_HOST;
const MONGO_PORT = process.env.MONGODB_PORT;
// console.log(`Attempting to send token\n${tokenID}\nto User: ${username}`);
// console.log(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBMS}?authSource=admin`);

function callThis(aa){
    var fs = require('fs');
    fs.writeFile('./testFile.txt.txt', aa, function (err) {
    // fs.appendFile('./testFile.txt.txt', aa+"\r\n");
    });
}

storage.connect()
    .then(() => callThis(projectToBeCopied))

    .then(() =>{
        return Projects.copyProject(copyProjectFrom, projectToBeCopied, saveTo, newProjectName)
    })
    .then(() => storage.disconnect())
    .catch(err => {
        console.error(err);
        return storage.disconnect();
    });
// /* eslint-enable no-console*/

