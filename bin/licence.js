#!/usr/bin/env node
// Copyright (c) 2018 Uber Technologies, Inc.
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

var minimist = require('minimist');

var uberLicense = require('../index.js');

var argv = minimist(process.argv.slice(2), {
    boolean: [
        'dry',
        'verbose',
        'silent',
        'help'
    ],
    string: [
        'file',
        'dir',
        'license',
        'legacy'
    ],
    alias: {
        license: ['licence', 'L'],
        file: 'F',
        dir: 'D',
        legacy: 'O',
        dry: 'd',
        verbose: 'v',
        silent: 's',
        help: 'h'
    }
});

/*eslint no-console: 0*/
// jscs:disable maximumLineLength
if (argv.help) {
    console.log('uber-licence');
    console.log('  ');
    console.log('  This binary will add a license to the top');
    console.log('  of all your files');
    console.log('');
    console.log('  Options:');
    console.log('    -d, --dry      does not write to files');
    console.log('    -F, --file     pattern of files to modify');
    console.log('    -D, --dir      pattern for directories containing files');
    console.log('    -L, --license  intended license template (file)');
    console.log('    -O, --legacy   licenses to replace');
    console.log('    -v, --verbose  log skipped and empty files');
    console.log('    -s, --silent   do not log fixed files');
}
else {
    uberLicense({
        dry: argv.dry,
        silent: argv.silent,
        verbose: argv.verbose,
        fileFilter: argv.file && argv.file.split(','),
        directoryFilter: argv.dir && argv.dir.split(','),
        license: argv.license && argv.license.split(','),
        legacy: argv.legacy && argv.legacy.split(',')
    });
}
