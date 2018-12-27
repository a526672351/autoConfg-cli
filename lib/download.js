'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const urllib = require('urllib');
const co = require('co');
const compressing = require('compressing');
const shell = require('shelljs');
const mkdirp = require('mz-modules/mkdirp');
const rimraf = require('mz-modules/rimraf');
const ora = require('ora');
const utils = require('./utils');

module.exports = class Download {
  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'autoconfg-cli-init');
  }

  *download(pkgName, dir, tgzUrl) {
    yield rimraf(this.tempDir);

    utils.log(`downloading ${tgzUrl}`, 'yellow');
    const response = yield urllib.request(tgzUrl, { streaming: true, followRedirect: true });
    const targetDir = path.join(this.tempDir, pkgName);
    yield compressing.tgz.uncompress(response.res, targetDir);

    utils.log(`extract to ${this.tempDir}`, 'yellow');
    return path.join(targetDir, 'package', dir);
  }

  copy(sourceDir, targetDir, option = { dir: '', hide: true }) {
    if (option.dir) {
      shell.cp('-R', path.join(sourceDir, option.dir), targetDir);
    } else {
      shell.cp('-R', path.join(sourceDir, '*'), targetDir);
      if (option.hide) { // copy hide file
        try {
          shell.cp('-R', path.join(sourceDir, '.*'), targetDir);
        } catch (e) {
          /* istanbul ignore next */
          console.warn('copy hide file error', e);
        }
      }
    }
  }

  writeFile(filepath, content) {
    try {
      fs.writeFileSync(filepath, typeof content === 'string' ? content : JSON.stringify(content, null, 2), 'utf8');
    } catch (e) {
      /* istanbul ignore next */
      console.error(`writeFile ${filepath} err`, e);
    }
  }

  updatePackageFile(fileDir, info = {}) {
    const { name, description, install = [] } = info;
    const filepath = path.join(fileDir, 'package.json');
    const packageJSON = require(filepath);
    const { devDependencies ={} } = packageJSON;

    packageJSON.name = name || packageJSON.name;
    packageJSON.version = '1.0.0';
    packageJSON.description = description || packageJSON.description;
    packageJSON.devDependencies = devDependencies;
    
    this.writeFile(filepath, packageJSON);
  }

  installDeps(projectDir, info) {
    const { npm } = info;
    if (npm) {
      const cmd = `${npm} install`;
      const spinner = ora(utils.log(`start ${cmd}...`));
      spinner.start()
      const result = shell.exec(cmd, { cwd: projectDir, stdio: ['inherit'] });
      if (result) {
        if (result.code === 0) {
          utils.log(`${cmd} successfully!`);
        } else {
          console.log(chalk.red(`${cmd} error`), result.stderr);
        }
      }
      spinner.stop();
    }
  }

  quickStart(projectName, info) {
    let i = 1;
    const { npm, run } = info;
    const steps = [`${i}) cd ${projectName}`];
    if (!npm) {
      i++;
      steps.push(`${i}) npm install or yarn install`);
    }
    i++;
    steps.push(`${i}) ${run || 'npm run dev or npm start' }`);

    utils.log(`Now, start coding by follow step:\r\n${steps.join('\r\n')}`);
  }

  init(root, bilerplateInfo, projectInfoAnswer = {}, options = {}) {
    const self = this;
    const { pkgName, sourceDir = '', run, value, tgzUrl } = bilerplateInfo;
    const { name, npm } = projectInfoAnswer;
    const projectName = name || value || pkgName;
    // console.log('bilerplateInfo', bilerplateInfo, 'projectInfoAnswer', projectInfoAnswer);
    co(function *() {
      const absSourceDir = yield self.download(pkgName, sourceDir, tgzUrl);
      const absTargetDir = path.join(root, projectName);
      yield mkdirp(absTargetDir);
      self.copy(absSourceDir, absTargetDir);
      self.updatePackageFile(absTargetDir, projectInfoAnswer);
      utils.log(`init ${projectName} project successfully!\r\n`);
      self.installDeps(absTargetDir, { npm });
      self.quickStart(projectName, { npm, run });
    }).catch(err => {
      /* istanbul ignore next */
      console.log('init error', err);
    });
  }
}