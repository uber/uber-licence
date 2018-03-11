# uber-licence
[![NPM version][npm-version-image]][npm-version-url] [![build status][build-png]][build]
<!--
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

<!-- [![browser support][test-png]][test] -->

**Utility to deal with Uber OSS licences**

## Example

```shell
> uber-licence
```
Running the `uber-licence` binary adds licencing information 
  to every javascript file in your project.

You can run `uber-licence --dry` where it does not mutate 
  any files and instead outputs -1.

You can use `--file` and `--dir` flags to specify your own 
  file and directory filters to select source files to consider.

Use the `-h` or `--help` flags to see all the available options.

## Recommended Config

We recommend that you add the following two scripts to your `package.json` and run `check-licence` in a git pre-commit.

```json
// package.json
{
  "scripts": {
    "check-licence": "uber-licence --dry",
    "add-licence": "uber-licence"
  },
  "devDependencies": {
    "uber-licence": "uber/uber-licence",
    "pre-commit": "0.0.9"
  },
  "pre-commit": [
    "test",
    "check-licence"
  ],
  "pre-commit.silent": true
}
```

## Installation

```shell
> npm install uber-licence --save-dev
```

## CLI Usage

```shell
> uber-licence [options]
```

## NodeJS API

```js
var uberLicence = require('uber-licence');
uberLicence(options);
```

## Options:

| API     | CLI             | Type    | Default   | Description | 
| ---     | ---             | ---     | ---       | --- |
|`dry`    |`-d`, `--dry`    |`Boolean`|`false`    | does not write to files |
|`file`   |`-F`, `--file`   |`String` |`*.js`     | pattern of files to modify |
|         |                 |`Array`[*](#n0)|     | |                            
|`dir`    |`-D`, `--dir`    |`String` |`.*`<sup>[1](#n1)</sup>| list of directory patterns containing files |
|         |                 |`Array`[*](#n0)|     |  |
|`license`|`-L`, `--license`|`String` |`undefined`| intended license template (file)<sup>[2](#n2)</sup> |
|         |                 |`Array`[*](#n0)|     | |       
|`legacy` |`-O`, `--legacy` |`String` |`undefined`| list of licenses to replace |
|         |                 |`Array`[*](#n0)|     | |
|`verbose`|`-v`, `--verbose`|`Boolean`|`false`    | log skipped and empty files |
|`silent` |`-s`, `--silent `|`Boolean`|`false`    | do not log fixed files |

<a name="n0">*</a> *On CLI use comma to separate multiple values* 
eg: `--flag=a,b,c` or `--flag a,b,c`

<a name="n1"><sup>1</sup></a> *The following directories are excluded by default:*
`.git, node_modules, coverage, env, .tox, vendor, Godeps`

<a name="n2"><sup>2</sup></a> *by default uses Uber's templates*

## Tests

```shell
> npm test
```

## Contributors

 - [Raynos](https://github.com/raynos)
 - [Kriskowal](https://github.com/kriskowal)
 - [Dawsonbotsford](https://github.com/dawsonbotsford)
 - [CxRes](https://github.com/cxres)

## MIT Licenced

  [build-png]: https://secure.travis-ci.org/uber/uber-licence.svg?branch=master
  [build]: https://travis-ci.org/uber/uber-licence
  [cover-png]: https://coveralls.io/repos/uber/uber-licence/badge.png
  [cover]: https://coveralls.io/r/uber/uber-licence
  [dep-png]: https://david-dm.org/uber/uber-licence.png
  [dep]: https://david-dm.org/uber/uber-licence
  [test-png]: https://ci.testling.com/uber/uber-licence.png
  [tes]: https://ci.testling.com/uber/uber-licence
  [npm-png]: https://nodei.co/npm/uber-licence.png?stars&downloads
  [npm]: https://nodei.co/npm/uber-licence
  [npm-version-image]: https://badge.fury.io/js/uber-licence.svg
  [npm-version-url]: https://npmjs.org/package/uber-licence
