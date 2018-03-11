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
var fs = require('fs');
var readdirp = require('readdirp');

var defaults = require('./defaults');
var LicenseFixer = require('./license-fixer');
var VALID_LICENSES = require('./valid-licences');

// automatically prompt user to update if on older version
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({pkg: pkg}).notify();

function uberLicense(options) {
    var dry = options.dry;
    var silent = options.silent;
    var verbose = options.verbose;

    if (options.licence && !options.license) {
        options.license = options.licence;
    }
    
    // If the user enter string when using the API version
    var licenses = (typeof options.license === 'string') ? 
        [options.license] : options.license;

    var legacy = (typeof options.legacy === 'string') ? 
        [options.legacy] : options.legacy;

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

    // Legacy should not override default license
    if (legacy) {
        for (var j = 0; j < legacy.length; j++) {
            // Replace file names with content of files
            licenses[licenses.length + j] = fs.readFileSync(legacy[j], 'utf8');
        } 
    }

    var licenseFixer = new LicenseFixer({
        dry: dry,
        silent: silent,
        verbose: verbose
    });

    // Set the intended license text
    licenseFixer.setLicense(licenses[0]);
    // Add a license to match and replace.
    // There can be multiple recognized licenses, for migration purposes.
    licenses.forEach(function(license) {
        licenseFixer.addLicense(license);
    });

    // If the user enters a string argument when using the API version
    var fileFilter = (typeof options.fileFilter === 'string') ? 
        [options.fileFilter] : options.fileFilter;

    var directoryFilter = (typeof options.directoryFilter === 'string') ? 
        [options.directoryFilter] : options.directoryFilter;

    readTree({
        root: process.cwd(),
        fileFilter: fileFilter || defaults.fileFilter,
        directoryFilter: directoryFilter || defaults.directoryFilter,
    }, processFiles);

    function readTree(opts, callback) {
        var stream = readdirp(opts);
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

        if (dry) {
            process.exit(fixed);
        } else {
            process.exit(0);
        }
    }
}


module.exports = uberLicense;