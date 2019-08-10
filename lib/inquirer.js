const inquirer = require('inquirer')

function getProjectBaseInfo(context) {
    return [{
        name: 'projectName',
        message: '项目名称',
        default: context.name
    }, {
        name: 'projectVersion',
        message: '项目版本号',
        default: '1.0.0'
    }, {
        name: 'projectDescription',
        message: '项目描述',
        default: `a project name ${context.name}`
    }]
}

function getTaroProjectBaseInfo(context) {
    return [
        ...getProjectBaseInfo(context),
        {
            name: 'projectAppId',
            message: 'AppId',
            default: `mini-program AppId`
        }
    ]
}

module.exports = {
    isInCurrent: () => inquirer.prompt([{
        name: 'isInCurrent',
        message: '项目是否创建在当前文件夹',
        type: 'confirm',
    }]),
    chooseProjectType: () => inquirer.prompt([{
        name: 'projectType',
        message: '项目类型',
        type: 'list',
        choices: [
            'chrome extension',
            'taro',
            'react',
            'vue'
        ]
    }]),
    projectInfo: {
        taro: (context) => inquirer.prompt(getTaroProjectBaseInfo(context)),
        default: (context) => inquirer.prompt(getProjectBaseInfo(context))
    }
}
