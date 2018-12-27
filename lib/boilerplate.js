'use strict';

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Download = require('./download');

module.exports = class Boilerplate {
  constructor (config = {}) {
    this.config = config;
    this.projectDir = process.cwd();
    this.ask = this.initAsk();
    this.boilerplateChoice = config.boilerplateChoice || this.ask.boilerplateChoice;
    this.boilerplateDetailChoice = config.boilerplateDetailChoice || this.ask.boilerplateDetailChoice;
    this.projectAskChoice = config.projectAskChoice || this.ask.projectAskChoice;
  }

  initAsk() {
    const asksync = path.resolve(__dirname, 'ask-sync.js');
    if (fs.existsSync(asksync)) {
      try {
        return require(asksync);
      } catch(err) {
        console.log(chalk.red('[autoConfg-cli] init sync error'), err);
      }
    }
    return require('./ask');
  }

  getBoilerplateInfo(name) {
    return this.boilerplateChoice.find(item => {
      return name === item.value;
    });
  }

  getBoilerplateDetailInfo(boilerplate, project) {
    const filterItems = this.boilerplateDetailChoice[boilerplate].filter(item => project === item.value);
    return filterItems.length > 0 ? filterItems[0] : null;
  }

  getProjectAskChoices(ranges){
    if (ranges === undefined) {
      return this.projectAskChoice;
    }
    return ranges.map(range => {
      return this.projectAskChoice.filter(choice => {
        return choice.name === range;
      })[0];
    });
  }

  /**
    * {
    *   type: String, // 表示提问的类型
    *   name: String, // 在最后获取到的answers回答对象中，作为当前这个问题的键
    *   message: String|Function, // 打印出来的问题标题，如果为函数的话
    *   default: String|Number|Array|Function, // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。
    *   choices: Array|Function, // 给出一个选择的列表，假如是一个函数的话，第一个参数为当前问题的输入答案。为数组时，数组的每个元素可以为基本类型中的值。
    *   validate: Function, // 接受用户输入，并且当值合法时，函数返回true。当函数返回false时，一个默认的错误信息会被提供给用户。
    *   filter: Function, // 接受用户输入并且将值转化后返回填充入最后的answers对象内。
    *   when: Function|Boolean, // 接受当前用户输入的answers对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。
    *   pageSize: Number, // 改变渲染list,rawlist,expand或者checkbox时的行数的长度。
    * }
   */
  init(options) {
    inquirer.prompt([{
      type: 'list',
      name: 'boilerplateName',
      message: 'please choose the boilerplate mode?',
      choices: this.boilerplateChoice
    }]).then(boilerplateAnswer => {
      const boilerplateName = boilerplateAnswer.boilerplateName;
      const boilerplateInfo = this.getBoilerplateInfo(boilerplateName);
      const choices = boilerplateInfo.choices;
      const download = new Download(options);
      if (this.boilerplateDetailChoice[boilerplateName]) {
        const boilerplateDetailAsk = [{
          type: 'list',
          name: 'project',
          message: 'please choose the boilerplate project mode?',
          choices: this.boilerplateDetailChoice[boilerplateName]
        }];
        inquirer.prompt(boilerplateDetailAsk).then(boilerplateDetailAnswer => {
          const project = boilerplateDetailAnswer.project;
          const bilerplateInfo = this.getBoilerplateDetailInfo(boilerplateName, project);
          const projectInfoChoice = this.getProjectAskChoices(choices);
          inquirer.prompt(projectInfoChoice).then(projectInfoAnswer => {
            download.init(this.projectDir, bilerplateInfo, projectInfoAnswer);
          });
        });
      } else {
        const pkgName = boilerplateInfo.pkgName || boilerplateName;
        const projectInfoChoice = this.getProjectAskChoices(choices);
        inquirer.prompt(projectInfoChoice).then(projectInfoAnswer => {
          const specialBoilerplateInfo = { pkgName, run: boilerplateInfo.run };
          download.init(this.projectDir, specialBoilerplateInfo, projectInfoAnswer);
        });
      }
    });
  };
}