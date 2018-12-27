'use strict';

const path = require('path');
const utils = require('./utils')
const Boilerplate = require('./boilerplate')

module.exports = class Action {
  constructor(command) {
    this.command = command;
    this.program = command.program;
    this.baseDir = command.baseDir;
  }

  init(boilerplate, options) {
    if (options.sync) {
      const filepath = path.resolve(__dirname, 'ask-sync.js');
      const url = options.sync === true ? 'https://raw.githubusercontent.com/a526672351/autoConfg-cli/master/lib/ask.js' : options.sync;
      utils.request(url).then(res => {
        fs.writeFileSync(filepath, res.data);
        console.log(`${chalk.green('autoConfg sync successfully, please run [autoConfg init] again')}`);
      }).catch(err => {
        console.log(chalk.red('autoConfg sync error:'), err);
      });
    } else {
      return new Boilerplate(boilerplate).init(options);
    }
  }
}