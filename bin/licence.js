#!/usr/bin/env node
// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var readdirp = require('readdirp');
var minimist = require('minimist');
var fs = require('fs');
var process = require('process');
var console = require('console');

// automatically prompt user to update if on older version
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
updateNotifier({pkg: pkg}).notify();

var LicenseFixer = require('../license-fixer');

var VALID_LICENSES = require('../valid-licences.js');

var argv = minimist(process.argv.slice(2));
var cwd = process.cwd();

/*eslint no-process-exit: 0, no-console: 0*/
// jscs:disable maximumLineLength
if (argv.help || argv.h) {
    console.log('uber-licence');
    console.log('  ');
    console.log('  This binary will add a license to the top');
    console.log('  of all your files');
    console.log('');
    console.log('  Options:');
    console.log('    --dry      does not write to files');
    console.log('    --file     pattern of files to modify');
    console.log('    --dir      pattern for directories containing files');
    console.log('    --license  intended license (file)');
    console.log('    --legacy   licenses to replace');
    console.log('    --verbose  log skipped and empty files');
    console.log('    --silent   do not log fixed files');
    process.exit(0);
}

var fileFilter = ['*.js'];
if (typeof argv.file === 'string') {
    fileFilter = [argv.file];
} else if (Array.isArray(argv.file)) {
    fileFilter = argv.file;
}

var directoryFilter = ['!.git', '!node_modules', '!coverage', '!env', '!.tox', '!vendor', '!Godeps'];
if (typeof argv.dir === 'string') {
    directoryFilter = [argv.dir];
} else if (Array.isArray(argv.dir)) {
    directoryFilter = argv.dir;
}

var licenses = null;

if (typeof argv.license === 'string') {
    licenses = licenses || [];
    licenses.push(argv.license);
} else if (Array.isArray(argv.license)) {
    licenses = licenses || [];
    Array.prototype.push.apply(licenses, argv.license);
}

// licence non-American spelling
if (typeof argv.licence === 'string') {
    licenses = licenses || [];
    licenses.push(argv.licence);
} else if (Array.isArray(argv.licence)) {
    licenses = licenses || [];
    Array.prototype.push.apply(licenses, argv.licence);
}

if (typeof argv.legacy === 'string') {
    licenses = licenses || [];
    licenses.push(argv.legacy);
} else if (Array.isArray(argv.legacy)) {
    licenses = licenses || [];
    Array.prototype.push.apply(licenses, argv.legacy);
}

if (licenses) {
    for (var i = 0; i < licenses.length; i++) {
        // Replace file names with content of files
        licenses[i] = fs.readFileSync(licenses[i], 'utf8');
    }
} else {
    // In the absense of any command line arguments,
    // use the Uber defaults.
    licenses = VALID_LICENSES;
}

var licenseFixer = new LicenseFixer({
    dry: argv.dry,
    silent: argv.silent,
    verbose: argv.verbose
});

// Set the intended license text
licenseFixer.setLicense(licenses[0]);
// Add a license to match and replace.
// There can be multiple recognized licenses, for migration purposes.
for (var i = 0; i < licenses.length; i++) {
    licenseFixer.addLicense(licenses[i]);
}

readTree({
    root: cwd,
    fileFilter: fileFilter,
    directoryFilter: directoryFilter
}, processFiles);

function readTree(options, callback) {
    var stream = readdirp(options);
    var files = [];
    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);
    function onData(event) {
        files.push(event.path);
    }
    function onEnd(err) {
        callback(err, files);
    }
}

function processFiles(err, files) {
    if (err) {
        console.error(err.message);
        process.exit(1);
        return;
    }

    var fixed = 0;
    for (var filesIndex = 0; filesIndex < files.length; filesIndex++) {
        var file = files[filesIndex];
        fixed = fixed + licenseFixer.fixFile(file);
    }

    if (argv.dry) {
        process.exit(fixed);
    } else {
        process.exit(0);
    }
}
