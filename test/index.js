var tape = require('tape');
var path = require('path');
var fs = require('fs-extra');
var temp = require('temp');
var exec = require('child_process').exec;
var escape = require('escape-string-regexp');

// Automatically track and cleanup files at exit
temp.track();

var uberLicensePath = path.join(__dirname, '..', 'bin', 'licence');

tape('add-header-none', function (t) {
	var fixturePath = path.join(__dirname, 'fixtures', 'add-header-none');
	var inputFilePath = path.join(fixturePath, 'input.js');
	var outputFileContent = fs.readFileSync(path.join(fixturePath, 'output.js'), 'utf8');

	// remove the dynamic year portion of the header comment
	var consistantOutputString = outputFileContent.substring(outputFileContent.indexOf('Permission'));
	var outputRegex = new RegExp(escape(consistantOutputString));

	temp.mkdir('add-header-none', function(mkTempErr, dirPath) {
	  if (mkTempErr) {
	  	return console.error('mkTempErr: ' + mkTempErr);
	  }
		fs.copy(inputFilePath, path.join(dirPath, 'input.js'), function (copyErr) {
		  if (copyErr) {
		  	return console.error('copyErr: ' + copyErr);
		  }
		  process.chdir(dirPath);
		  exec(uberLicensePath + ' ./input.js', function(execErr) {
		  	if (execErr instanceof Error) {
		  		throw execErr;
		  	}
				var inputFileContent = fs.readFileSync('input.js', 'utf8');
				// delete until newline in outputRegex
				t.true(outputRegex.test(inputFileContent), 'should prepend header');
				t.end();
		  });
		});
	});
});

// tape('dont-add-header', function (t) {
// 	t.pass();
// 	t.end();
// });
