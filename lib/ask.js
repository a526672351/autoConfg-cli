'use strict';
const chalk = require('chalk');
exports.boilerplateChoice = [
  {
    name: `Create ${chalk.green('Egg + Fis3')} Server Side Render Application`,
    value: 'boilerplate-egg-fis3'
  },
  {
    name: `Create ${chalk.green('Egg + Vue')} Server Side Render Application`,
    value: 'boilerplate-egg-vue'
  }
];

exports.boilerplateDetailChoice = {
  'boilerplate-egg-fis3': [
    {
      name: `Create ${chalk.green('Egg + Fis3')} Application`,
      value: 'egg-fis3',
      pkgName: 'egg-fis3-typescript-multiple-html-boilerplate-master',
      tgzUrl: 'https://github.com/a526672351/egg-fis3-typescript-multiple-html-boilerplate/archive/master.zip'
    }
  ],
  'boilerplate-egg-vue': [
    {
      name: `Create ${chalk.green('Egg + Vue')} Application`,
      value: 'egg-vue',
      pkgName: 'egg-vue-boilerplate-master',
      tgzUrl: 'https://github.com/a526672351/egg-vue-boilerplate/archive/master.zip'
    }
  ]
};

exports.projectAskChoice = [
  {
    type: 'input',
    name: 'name',
    message: 'Please input project name:'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please input project description:'
  },
  {
    type: 'list',
    name: 'npm',
    message: 'Please choose the way to install dependency:',
    choices: [
      {
        name: 'npm',
        value: 'npm',
        checked: true
      },
      {
        name: 'yarn',
        value: 'yarn'
      },
      {
        name: 'cnpm',
        value: 'cnpm'
      },
      {
        name: 'tnpm',
        value: 'tnpm'
      },
      {
        name: 'none',
        value: null
      }
    ]
  }
];