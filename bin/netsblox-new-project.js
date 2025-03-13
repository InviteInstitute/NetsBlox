'use strict';
var path = require('path');
const networkTopology = require('../src/server/network-topology');
// eslint-disable-next-line no-unused-vars

require('dotenv').load({
    path: path.join(__dirname, '..', '.env'),
    silent: true
});
/* eslint-disable no-console*/
require('epipebomb')();  // Allow piping to 'head'

var _ = require('lodash'),
    Utils = _.extend(require('../src/server/utils.js'), require('../src/server/server-utils.js')),
    Command = require('commander').Command,
    Storage = require('../src/server/storage/storage'),
    Logger = require('../src/server/logger'),
    Projects = require('../src/server/storage/projects'),
    logger = new Logger('netsblox:cli:projects'),
    storage = new Storage(logger),
    program = new Command();

program
    .arguments('[username] [projectname]', 
        'Creates a new project for the given user')
    .option('-a,--all', 'Include transient projects')
    .parse(process.argv);

let username = program.args[0];
let projectname = program.args[1];
let roleName = 'myRole';
let name = 'untitled';

var project = null;

storage.connect()
    .then(() => {
        logger.trace('Creating a new project ' + projectname +
             ' for ' + username);
        project = Projects.new({owner: username, name: projectname});
        return project;
    })
    .then(project => {
        console.log(project);
        logger.trace('Creating a new role ' + roleName + ' for ' + projectname);
        let roleblob = project.setRole(roleName, Utils.getEmptyRole(roleName))
            .then(() => project.setName(projectname));
        console.log(roleblob);
        return project;
    })
    .then(project => {
        return project.getRoleId(roleName);
    })
    .then(roleId => {
        console.log(roleId);
        const projectId = project._id;
        logger.trace(`Created new project: ${projectId} (${roleName})`);
        return networkTopology.setClientState(username, projectId, roleId, username)
            .then(() => console.log('done?'));
    })
    .then(() => {
        console.log('finished?');
        storage.disconnect();
    })
    .catch(err => {
        console.error(err);
        return storage.disconnect();
    });