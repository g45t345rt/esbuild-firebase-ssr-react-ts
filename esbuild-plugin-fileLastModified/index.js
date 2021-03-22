const fs = require('fs')

const fileLastModifiedPlugin = (opts) => {
  const { srcDir = './src', identifier = '__fileLastModified__' } = opts || {}
  const find = new RegExp(identifier, 'g')
  const srcDirAbs = require('path').resolve(srcDir)
  return {
    name: 'esbuild-plugin-fileLastModified',
    setup (build) {
      build.onLoad({ filter: /.*/ }, (args) => {
        const { path } = args
        if (path.startsWith(srcDirAbs)) {
          let data = fs.readFileSync(path, "utf8")
          if (data.match(find)) {
            const stats = fs.statSync(path)
            const ext = path.split('.').pop()
            data = data.replace(find, stats.mtimeMs)
            return { contents: data, loader: ext }
          }
        }
      })
    }
  }
}

module.exports = fileLastModifiedPlugin
