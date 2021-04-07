'use strict';
var path = require('path');
// eslint-disable-next-line no-unused-vars

require('dotenv').load({
    path: path.join(__dirname, '..', '.env'),
    silent: true
});
// // #!/usr/bin/env node

require('epipebomb')();  // Allow piping to 'head'

var Command = require('commander').Command,
    program = new Command(),
    version = require('../package.json').version;

program
    .version('v'+version);

program
    .command('list', 'list the existing groups')
    .parse(process.argv);
