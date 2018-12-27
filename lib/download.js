'use strict';

const path = require('path');
const os = require('os');
const urllib = require('urllib');
const co = require('co');
const utils = require('./utils');

module.exports = class Download {
  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'autoconfg-cli-init');
  }

  init(root, bilerplateInfo, projectInfoAnswer = {}, options = {}) {
    const self = this;
    const { pkgName, sourceDir = '', run, value } = bilerplateInfo;
    const { name, npm } = projectInfoAnswer;
    const projectName = name || value || pkgName;
    console.log('bilerplateInfo', bilerplateInfo, 'projectInfoAnswer', projectInfoAnswer);
  }
}