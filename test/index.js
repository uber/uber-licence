var test = require('tape');

var uberLicence = require('../index.js');

test('uberLicence is a function', function (assert) {
    assert.strictEqual(typeof uberLicence, 'function');
    assert.end();
});
