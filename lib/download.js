'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const urllib = require('urllib');
const co = require('co');
const compressing = require('compressing');
const shell = require('shelljs');
const assert = require('assert');
const mkdirp = require('mz-modules/mkdirp');
const rimraf = require('mz-modules/rimraf');
const ora = require('ora');
const ProxyAgent = require('proxy-agent');
const utils = require('./utils');

module.exports = class Download {
  constructor(config = {}) {
    this.tempDir = path.join(os.tmpdir(), 'autoconfg-cli-init');
    this.registry = config.registry || 'https://registry.npmjs.org';
    this.httpClient = urllib.create();
  }

  *getPackageInfo(pkgName) {
    utils.log(`query npm info of ${pkgName}`, 'yellow');
    const url = `${this.registry}/${pkgName}/latest`;
    try {
      const result = yield this.httpClient.request(url, {
        dataType: 'json',
        followRedirect: true,
        timeout: 30000
      });
      assert(result.status === 200, `npm info ${pkgName} got error: ${result.status}, ${result.data.reason}`);
      return result.data;
    } catch (err) {
      /* istanbul ignore next */
      throw err;
    }
  }
  *download(pkgName, dir, tgzUrl) {
    let downUrl;
    let repoStatus;
    let pkgDir = '';
    if (!tgzUrl) {
      const result = yield this.getPackageInfo(pkgName);
      downUrl = result.dist.tarball;
      repoStatus = false;
    } else {
      repoStatus = true;
      downUrl = tgzUrl;
    }
    yield rimraf(this.tempDir);

    utils.log(`downloading ${downUrl}`, 'yellow');
    const response = yield this.curl(downUrl, { streaming: true, followRedirect: true });
    if (repoStatus) {
      const pressType = response.headers['content-type'].replace('application/', '');
      pkgDir = response.headers['content-disposition'].match(/filename="?(.*)\.(.*)"?/)[1];
      yield compressing[pressType].uncompress(response.res, this.tempDir);
    } else {
      pkgDir = 'package';
      yield compressing.tgz.uncompress(response.res, this.tempDir);
    }

    utils.log(`extract to ${this.tempDir}`, 'yellow');
    return path.join(this.tempDir, pkgDir, dir);
  }

  /**
   * send curl to remote server
   * @param {String} url - target url
   * @param {Object} [options] - request options
   * @return {Object} response data
   */
  * curl(url, options) {
    return yield this.httpClient.request(url, options);
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
    const proxyHost = process.env.http_proxy || process.env.HTTP_PROXY;
    if (proxyHost) {
      const proxyAgent = new ProxyAgent(proxyHost);
      this.httpClient.agent = proxyAgent;
      this.httpClient.httpsAgent = proxyAgent;
      utils.log(`use http_proxy: ${proxyHost}`);
    }
    const self = this;
    const { pkgName, sourceDir = '', run, value, tgzUrl, private_token } = bilerplateInfo;
    const { name, npm } = projectInfoAnswer;
    const projectName = name || value || pkgName;
    let repoUrl = tgzUrl;
    if (private_token) {
      if (tgzUrl.indexOf('?') !== -1) {
        repoUrl = `${tgzUrl}&private_token=${private_token}`;
      } else {
        repoUrl = `?private_token=${private_token}`;
      }
    }
    co(function *() {
      const absSourceDir = yield self.download(pkgName, sourceDir, repoUrl, private_token);
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