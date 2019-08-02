const inquirer = require('inquirer')

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
            'react',
            'vue'
        ]
    }]),
    getProjectInfo: (context) => inquirer.prompt([{
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
    }])
}
