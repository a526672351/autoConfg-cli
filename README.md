autoConfg-cli
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/autoconfg-cli.svg?style=flat-square
[npm-url]: https://npmjs.org/package/autoconfg-cli
[travis-image]: https://img.shields.io/travis/a526672351/autoConfg-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/a526672351/autoConfg-cli
[codecov-image]: https://codecov.io/gh/a526672351/autoConfg-cli/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/a526672351/autoConfg-cli
[david-image]: https://img.shields.io/david/a526672351/autoConfg-cli.svg?style=flat-square
[david-url]: https://david-dm.org/a526672351/autoConfg-cli
[snyk-image]: https://snyk.io/test/npm/autoconfg-cli/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/autoconfg-cli
[download-image]: https://img.shields.io/npm/dm/autoconfg-cli.svg?style=flat-square
[download-url]: https://npmjs.org/package/autoconfg-cli

Init project repository helper tools.

## Install

```bash
$ npm i autoConfg-cli -g
$ autoConfg -h
$ autoConfg init --sync [url]
$ autoConfg init
```

## Create a `simple` type application

```bash
$ autoConfg init
```

## Command

```
Usage: autoConfg init

Options:
  --sync          sync autoConfg init prompt template config                      [string]
  --registry, -r  npm registry, support china/npm/custom, default to auto detect  [string]
  --version       Show version number                                             [boolean]
  -h, --help      Show help                                                       [boolean]
```

## License

[MIT](LICENSE)
