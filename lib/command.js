'use strict';

const path = require('path');
const program = require('commander');
const Action = require('./action');

module.exports = class Command {
  constructor () {
    this.program = program;
    this.baseDir = process.cwd();
    this.boilerplate = {};
    this.commands = ['init'];
    this.action = new Action(this);
  }

  version() {
    const pkg = require(path.resolve(__dirname, '../package.json'));
    this.program.version(pkg.version);
  }

  command() {
    this.commands.forEach(cmd => {
      if (this[cmd]) {
        this[cmd].apply(this);
      } else {
        console.log(chalk.red(`The command [${cmd}] is not implemented!`));
      }
    });
  }

  parse() {
    this.program.parse(process.argv);
  }

  run () {
    this.version();
    this.command();
    this.parse();
  }

  init() {
    this.program
      .command('init')
      .option('--sync [url]', 'sync autoConfg init prompt template config')
      .description('init boilerplate for Project')
      .action(options => {
        this.action.init(this.boilerplate, options);
      });
  }
}