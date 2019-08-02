const download = require('download-git-repo')
const path = require('path')
const fs = require('fs')
const ora = require('ora')

module.exports = (target, type) => {
    const temp = path.join(target || '.', '.download-temp')
    const source = `lerhxx/templates-repo#${type ? type :'master'}`
    const spinner = ora(`正在下载项目模板，源地址：${source}`)
    spinner.start()
    
    return new Promise((resolve, reject) => {
        download(source, temp, { clone: true }, err => {
            if (err) {
                spinner.fail()
                reject(err)
            } else {
                try {
                    spinner.succeed()
                    resolve(temp)
                } catch(err) {
                    reject(err)
                }
            }
        })
    })
}

function copyDir(target, source='.') {
    try {
        const files = fs.readdirSync(source)
        files.forEach(name => {
            const fileName = path.resolve(process.cwd(), path.join(source, name))
            const sourcePath = `${target}/${name}`
            if (fs.statSync(fileName).isDirectory()) {
                !fs.existsSync(sourcePath) && fs.mkdirSync(sourcePath)
                copyDir(sourcePath, fileName)
            } else {
                fs.copyFileSync(fileName, sourcePath)
            }
        })
    } catch(err) {
        console.log('err', err)
        throw err
    }
}

