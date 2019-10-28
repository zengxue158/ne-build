#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')

const program = require('commander')
const download = require('download-git-repo')

const inquirer = require('inquirer')
const _ = require('lodash')
const chalk = require('chalk')
const ora = require('ora')

const pkg = require('../package.json')

/*
 *
 * 命令：
 * - ne-build init
 * # 通用命令
 * - ne-build h5
 * # 等同于 -t NyPhile/h5_template
 * - ne-build post
 * # 等同于 -t NyPhile/post_template
 *
 * 参数：
 * - 项目名称 projectName
 * - 频道名称 projectChannel
 * - 项目描述 projectDesc
 * - 模板地址 templatePath
 * - 上传账号 username
 * - 上传密码 password
 *
 */

const requiredPrompts = [
  {
    key: 'projectName',
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称(小写字母、数字、_)',
    validate: input => !input ? '不能为空' : true
  },{
    key: 'projectChannel',
    type: 'input',
    name: 'projectChannel',
    message: '请输入项目频道名(如：news)',
    validate: input => !input ? '不能为空' : true
  },{
    key: 'projectDesc',
    type: 'input',
    name: 'projectDesc',
    message: '请输入项目描述(可为空)'
  },{
    key: 'templatePath',
    type: 'input',
    name: 'template',
    message: '请输入模板地址(如：NyPhile/h5_template)',
    validate: input => !input ? '不能为空' : true
  },{
    key: 'username',
    type: 'input',
    name: 'username',
    message: '请输入邮箱前缀(上传用)',
    validate: input => !input ? '不能为空' : true
  },{
    key: 'password',
    type: 'password',
    name: 'password',
    message: '请输入邮箱密码(上传用)',
    validate: input => !input ? '不能为空' : true
  }
]

program
  .version(pkg.version, '-v, --version', 'output the current version')
  .description('Description: \n  H5模板构建工具 for NETEASE')

program
  .command('init [projectName]')
  .alias('i')
  .description('创建项目')
  .option('-n, --projectName <input>', '项目名称')
  .option('-c, --projectChannel <input>', '频道名称')
  .option('-d, --projectDesc <input>', '项目描述')
  .option('-t, --templatePath <input>', '模板地址')
  .option('--username <input>', '上传账号')
  .option('--password <input>', '上传密码')
  .action((projectName, option) => {
    let config = _.assign({
      projectName: projectName ? projectName : null,
      projectChannel: null,
      projectDesc: null,
      templatePath: null,
      username: null,
      password: null
    }, option)

    console.log('')
    console.log(chalk.magenta('准备创建项目'))
    console.log('')

    inquire(config).then(answers => {
      answers = _.assign(config, answers)

      downloadReop(answers, projectName)
    })
  })

program
  .command('h5 [projectName]')
  .description('创建H5项目')
  .option('-n, --projectName <input>', '项目名称')
  .option('-c, --projectChannel <input>', '频道名称')
  .option('-d, --projectDesc <input>', '项目描述')
  .option('--username <input>', '上传账号')
  .option('--password <input>', '上传密码')
  .action((projectName, option) => {
    let config = _.assign({
      projectName: projectName ? projectName : null,
      projectChannel: null,
      projectDesc: null,
      templatePath: 'NyPhile/h5_template',
      username: null,
      password: null
    }, option)

    console.log('')
    console.log(chalk.magenta('准备创建项目'))
    console.log('')

    inquire(config).then(answers => {
      answers = _.assign(config, answers)

      downloadReop(answers, projectName)
    })
  })

program
  .command('post [projectName]')
  .description('创建文章页项目')
  .option('-n, --projectName <input>', '项目名称')
  .option('-c, --projectChannel <input>', '频道名称')
  .option('-d, --projectDesc <input>', '项目描述')
  .option('--username <input>', '上传账号')
  .option('--password <input>', '上传密码')
  .action((projectName, option) => {
    let config = _.assign({
      projectName: projectName ? projectName : null,
      projectChannel: null,
      projectDesc: null,
      templatePath: 'NyPhile/post_template',
      username: null,
      password: null
    }, option)

    console.log('')
    console.log(chalk.magenta('准备创建项目'))
    console.log('')

    inquire(config).then(answers => {
      answers = _.assign(config, answers)

      downloadReop(answers, projectName)
    })
  })

program.parse(process.argv)

function inquire (param) {
  let prompts = []

  requiredPrompts.map(item => {
    let key = item.key

    if (!param[key]) {
      prompts.push(item)
    }
  })

  return inquirer.prompt(prompts)
}

function downloadReop (param, path) {
  const projectPath = path ? `./${path}/` : './'
  const spinner = ora('正在下载模板').start()
  download(param.templatePath, projectPath, err => {
    if (err) {
      console.log(err)
    } else {
      let packageFile = {}
      let packagePath = `${projectPath}package.json`
      if (fs.existsSync(packagePath)) {
        packageFile = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      }
      packageFile.name = param.projectName
      packageFile.channel = param.projectChannel
      packageFile.description = param.projectDesc || ''
      fs.writeFileSync(packagePath, JSON.stringify(packageFile, null, 2))

      let ftppass = {}
      let ftppassPath = `${projectPath}.ftppass`
      if (fs.existsSync(ftppassPath)) {
        ftppass = JSON.parse(fs.readFileSync(ftppassPath, 'utf-8'))
      }
      ftppass.username = param.username
      ftppass.password = param.password
      fs.writeFileSync(ftppassPath, JSON.stringify(ftppass, null, 2))

      let readme = ''
      let readmePath = `${projectPath}README.md`
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf-8')
      }
      readme = readme.replace('# 项目标题', '# ' + param.projectName)
      fs.writeFileSync(readmePath, readme)

      console.log('')
      console.log(chalk.magenta('完成'))
      console.log('')
      spinner.stop()
    }
  })
}
