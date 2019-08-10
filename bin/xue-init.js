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

async function checkProjectName(projectName) {
    try {
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
        } else if (rootName === projectName) {
            const { isInCurrent } = await inquirer.isInCurrent()
            if (!isInCurrent) {
                console.log(`项目 ${projectName} 创建失败`)
                return
            }
            rootName = '.'
        } else {
            rootName = projectName
        }
    
        return rootName
    } catch(err) {
        throw err
    }
}

async function go(rootName, projectRoot) {

    try {
        const { projectType } = await inquirer.chooseProjectType()
        const formatProjectType = projectType.replace(/\s/g, '-')
        const target = await download(projectRoot, formatProjectType)
        const context = {
            name: rootName,
            root: projectRoot,
            temp: target
        }
        const getPorjectInfo = inquirer.projectInfo[formatProjectType] ? inquirer.projectInfo[formatProjectType] : inquirer.projectInfo['default']
        const infoAnswers = await getPorjectInfo(context)
        context.metadata = { ...infoAnswers }

        await generator(context.temp, context.metadata, context.root)
        console.log(logSymbols.success, chalk.green('创建成功\n'))
        console.log(chalk.green(`cd ${context.root} \nyarn install \nyarn dev`))
    } catch(err) {
        throw err
    }
}

(async () => {
    let projectRoot = ''
    try {
        program.parse(process.argv)
    
        let projectName = program.args[0]
    
        if (!projectName) {
            console.log('请输入项目名称')
            program.help()
            return
        }

        const rootName = await checkProjectName(projectName)
        projectRoot = path.resolve(process.cwd(), path.join('.', projectName))
        rootName && await go(rootName, projectRoot)
    } catch(err) {
        console.log('创建失败', err)
        rimraf(projectRoot, () => {})
    }
})()

process.on('uncatchException', err => {
    console.log('uncatchException', err)
})
