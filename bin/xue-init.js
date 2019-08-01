#! /usr/local/bin/node
const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const rimraf = require('rimraf')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const download = require('../lib/download.js')
const inquirer = require('../lib/inquirer')
const generator = require('../lib/generator')

function checkProjectName(projectName) {
    const list = glob.sync('*')
    let rootName = path.basename(process.cwd())
    
    if (list.length) {
        const reg = new RegExp(`/${projectName}$`, 'i')
        const filter = list.filter(name => {
            const fileName = path.resolve(process.cwd(), path.join('.', name))
            return reg.test(fileName) && fs.statSync(fileName).isDirectory()
        })
        if (filter.length) {
            console.log(`项目 ${projectName} 已经存在`)
            return
        }
        rootName = projectName
    } else {
        rootName = rootName === projectName ? '.' : projectName
    }

    return rootName
}


async function go(rootName) {
    const projectRoot = path.resolve(process.cwd(), path.join('.', rootName))

    try {
        const typeAnswers = await inquirer.getProjectType()
        const target = await download(projectRoot, typeAnswers.projectType.replace(/\s/g, '-'))
        const context = {
            name: rootName,
            root: projectRoot,
            temp: target
        }
        const infoAnswers = await inquirer.getProjectInfo(context)
        context.metadata = { ...infoAnswers }

        await generator(context.temp, context.metadata, context.root)
        console.log(logSymbols.success, chalk.green('创建成功\n'))
        console.log(chalk.green(`cd ${context.root} \nyarn install \nyarn dev`))
    } catch(err) {
        console.log('创建失败', err)
        rimraf(projectRoot, () => {})
    }
}

(() => {
    program.usage('<project-name>').parse(process.argv)

    let projectName = program.args[0]

    if (!projectName) {
        console.log('请输入项目名称')
        program.help()
        return
    }

    const rootName = checkProjectName(projectName)
    rootName && go(rootName)
})()

process.on('uncatchException', err => {
    console.log('uncatchException', err)
})
