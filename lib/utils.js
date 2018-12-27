'use strict';

const urllib = require('urllib');
const chalk = require('chalk');

module.exports = {
  /* istanbul ignore next */
  log(info, color = 'green') {
    /* istanbul ignore next */
    console.log(chalk.blue(`[autoconfg-cli]:${chalk[color](info)}`));
  },
  request(url, options) {
    return urllib.request(url, options);
  }
}