const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = (src, metadata={}, dest='.') => {
    if (!src) {
        return Promise.reject(new Error(`无效的 source: ${src}`))
    }

    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                Object.keys(files).forEach(fileName => {
                    console.log('fileName', fileName)
                    if (!/\.(png|jpe?g|svg|gif)$/.test(fileName)){
                        console.log('fileName test', fileName)
                        const t = files[fileName].contents.toString()
                        files[fileName].contents = Buffer.from(Handlebars.compile(t)(meta))
                    }
                })
                done()
            }).build(err => {
                rm(src)
                err ? reject(err) : resolve()
            })
    })
}