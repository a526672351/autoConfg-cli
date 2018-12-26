autoConfg-cli
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/autoConfg-cli.svg?style=flat-square
[npm-url]: https://npmjs.org/package/autoConfg-cli
[travis-image]: https://img.shields.io/travis/a526672351/autoConfg-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/a526672351/autoConfg-cli
[codecov-image]: https://codecov.io/gh/a526672351/autoConfg-cli/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/a526672351/autoConfg-cli
[david-image]: https://img.shields.io/david/a526672351/autoConfg-cli.svg?style=flat-square
[david-url]: https://david-dm.org/a526672351/autoConfg-cli
[snyk-image]: https://snyk.io/test/npm/autoConfg-cli/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/autoConfg-cli
[download-image]: https://img.shields.io/npm/dm/autoConfg-cli.svg?style=flat-square
[download-url]: https://npmjs.org/package/autoConfg-cli

Init project repository helper tools.

## Install

```bash
$ npm i autoConfg-cli -g
$ autoConfg -h
```

## Create a `simple` type application

```bash
$ autoConfg --type simple [dest]
```

## Command

```
Usage: autoConfg [dir] --type=simple

Options:
  --type          boilerplate type                                                [string]
  --dir           target directory                                                [string]
  --force, -f     force to override directory                                     [boolean]
  --template      local path to boilerplate                                       [string]
  --package       boilerplate package name                                        [string]
  --registry, -r  npm registry, support china/npm/custom, default to auto detect  [string]
  --silent        don't ask, just use default value                               [boolean]
  --version       Show version number                                             [boolean]
  -h, --help      Show help                                                       [boolean]
```

## License

[MIT](LICENSE)
