'use strict';
var path = require('path');
// eslint-disable-next-line no-unused-vars

require('dotenv').load({
    path: path.join(__dirname, '..', '.env'),
    silent: true
});
// // #!/usr/bin/env node

require('epipebomb')();  // Allow piping to 'head'

const Groups = require('../src/server/storage/groups'),
    { runWithStorage } = require('./utils');

// List all the groups
async function listGroups() {
    const groups = await Groups.all();
    for (let idx in groups) {
        const group = groups[idx];
        let members = await group.findMembers();
        let mUsernames = members.map(m => m.username);
        console.log([
            group.name,
            'members:',
            mUsernames.join(','),
        ].join('\t'));
    }
}

runWithStorage(listGroups);
