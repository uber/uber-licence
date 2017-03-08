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
	var consistentOutputString = "^".concat(esc(outputFileContent).replace(new RegExp(/\d{4}/), "\\d{4}"));
	var outputRegex = new RegExp(consistentOutputString);

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

tape('add-nonstandard-header', function (t) {
	t.plan(3);
	var fixturePath = path.join(__dirname, 'fixtures', 'add-nonstandard-header');
	var input1FilePath = path.join(fixturePath, 'input-1.js');
	var input2FilePath = path.join(fixturePath, 'input-2.js');
	var input3FilePath = path.join(fixturePath, 'input-3.js');
	var output1FileContent = fs.readFileSync(path.join(fixturePath, 'output-1.js'), 'utf8');
	var output2FileContent = fs.readFileSync(path.join(fixturePath, 'output-2.js'), 'utf8');
	var output3FileContent = fs.readFileSync(path.join(fixturePath, 'output-3.js'), 'utf8');

	// remove the dynamic year portion of the header comment
	var consistentOutputString = "^".concat(esc(output1FileContent).replace(new RegExp(/\d{4}/), "\\d{4}"));
	var output1Regex = new RegExp(consistentOutputString);
	consistentOutputString = "^".concat(esc(output2FileContent).replace(new RegExp(/\d{4}/), "\\d{4}"));
	var output2Regex = new RegExp(consistentOutputString);
	consistentOutputString = "^".concat(esc(output3FileContent).replace(new RegExp(/\d{4}/), "\\d{4}"));
	var output3Regex = new RegExp(consistentOutputString);

	temp.mkdir('add-header', function(mkTempErr, dirPath) {
	  if (mkTempErr) {
	  	return console.error('mkTempErr: ' + mkTempErr);
	  }
	  process.chdir(dirPath);
		fs.copySync(input1FilePath, 'input-1.js');
		fs.copySync(input2FilePath, 'input-2.js');
		fs.copySync(input3FilePath, 'input-3.js');
	  exec(uberLicensePath, function(execErr) {
	  	if (execErr instanceof Error) {
	  		throw execErr;
	  	}
			var input1FileContent = fs.readFileSync('input-1.js', 'utf8');
			var input2FileContent = fs.readFileSync('input-2.js', 'utf8');
			var input3FileContent = fs.readFileSync('input-3.js', 'utf8');

			t.true(output1Regex.test(input1FileContent), 'should have flow, then blank line, then license');
			t.true(output2Regex.test(input2FileContent), 'should have shebang, then blank line, then license');
			t.true(output3Regex.test(input3FileContent), 'should have shebang, then flow, then blank line, then license');
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
	var consistentOutputString = "^".concat(esc(outputFileContent).replace(new RegExp(/\d{4}/), "\\d{4}"));
	var outputRegex = new RegExp(consistentOutputString);

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
