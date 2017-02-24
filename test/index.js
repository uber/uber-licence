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

var tape = require('tape');
var path = require('path');
var fs = require('fs-extra');
var temp = require('temp');
var exec = require('child_process').exec;
var esc = require('escape-string-regexp');

// Automatically track and cleanup files at exit
temp.track();

var uberLicensePath = path.join(__dirname, '..', 'bin', 'licence.js');

tape('add-header', function (t) {
	t.plan(2);
	var fixturePath = path.join(__dirname, 'fixtures', 'add-header');
	var input1FilePath = path.join(fixturePath, 'input-1.js');
	var input2FilePath = path.join(fixturePath, 'input-2.js');
	var outputFileContent = fs.readFileSync(path.join(fixturePath, 'output.js'), 'utf8');

	// remove the dynamic year portion of the header comment
	var consistantOutputString = outputFileContent.substring(outputFileContent.indexOf('Permission'));
	var outputRegex = new RegExp(esc(consistantOutputString));

	temp.mkdir('add-header', function(mkTempErr, dirPath) {
	  if (mkTempErr) {
	  	return console.error('mkTempErr: ' + mkTempErr);
	  }
	  process.chdir(dirPath);
		fs.copySync(input1FilePath, 'input-1.js');
		fs.copySync(input2FilePath, 'input-2.js');
	  exec(uberLicensePath, function(execErr) {
	  	if (execErr instanceof Error) {
	  		throw execErr;
	  	}
			var input1FileContent = fs.readFileSync('input-1.js', 'utf8');
			var input2FileContent = fs.readFileSync('input-2.js', 'utf8');

			t.true(outputRegex.test(input1FileContent), 'should prepend header to file without header');
			t.true(outputRegex.test(input2FileContent), 'should replace old header (from 2016)');
			t.end();
		});
	});
});

tape('dont-add-header', function (t) {
	t.plan(1);
	var fixturePath = path.join(__dirname, 'fixtures', 'dont-add-header');
	var inputFilePath = path.join(fixturePath, 'input.js');
	var outputFileContent = fs.readFileSync(path.join(fixturePath, 'output.js'), 'utf8');

	// remove the dynamic year portion of the header comment
	var consistantOutputString = outputFileContent.substring(outputFileContent.indexOf('Permission'));
	var outputRegex = new RegExp(esc(consistantOutputString));

	temp.mkdir('dont-add-header', function(mkTempErr, dirPath) {
	  if (mkTempErr) {
	  	return console.error('mkTempErr: ' + mkTempErr);
	  }
	  process.chdir(dirPath);
	  fs.copySync(inputFilePath, 'input.js');
	  exec(uberLicensePath, function(execErr) {
	  	if (execErr instanceof Error) {
	  		throw execErr;
	  	}
			var inputFileContent = fs.readFileSync('input.js', 'utf8');
			t.true(outputRegex.test(inputFileContent), 'should prepend header');
			t.end();
		});
	});
});

tape('add-flow-header', function (t) {
	t.plan(1);
	var fixturePath = path.join(__dirname, 'fixtures', 'add-flow-header');
	var inputFilePath = path.join(fixturePath, 'input.js');
	var outputFileContent = fs.readFileSync(path.join(fixturePath, 'output.js'), 'utf8');

	// remove the dynamic year portion of the header comment
	var consistantOutputString = outputFileContent.substring(outputFileContent.indexOf('Permission'));
	var outputRegex = new RegExp(esc(consistantOutputString));

	temp.mkdir('add-flow-header', function(mkTempErr, dirPath) {
	  if (mkTempErr) {
	  	return console.error('mkTempErr: ' + mkTempErr);
	  }
	  process.chdir(dirPath);
	  fs.copySync(inputFilePath, 'input.js');
	  exec(uberLicensePath, function(execErr) {
	  	if (execErr instanceof Error) {
	  		throw execErr;
	  	}
			var inputFileContent = fs.readFileSync('input.js', 'utf8');
			t.true(outputRegex.test(inputFileContent), 'should add header after flow header');
			t.end();
		});
	});
});
