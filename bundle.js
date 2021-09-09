const esbuild = require('esbuild')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const aliasPlugin = require('esbuild-plugin-alias')
const autoprefixer = require('autoprefixer')
const postCssPlugin = require('esbuild-plugin-postcss2').default
const EventEmitter = require('events')
const fileLastModifiedPlugin = require('esbuild-plugin-filelastmodified').default
const chokidar = require('chokidar')
const copyfiles = require('copyfiles')
const http = require('http')
const postcssUrl = require('postcss-url')
const postcssImport = require('postcss-import')

const bundleEmitter = new EventEmitter()
const argv = yargs(hideBin(process.argv)).argv

const env = argv.env || 'development'
const refreshPort = argv.refreshPort
const isProduction = env === 'production'

// https://sass-lang.com/documentation/js-api#includepaths
process.env['SASS_PATH'] = 'src/app/theme'

if (!isProduction && refreshPort) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    })

    bundleEmitter.once('rebuild', () => {
      res.write(`event: refresh\ndata: \n\n`)
    })
  })

  server.listen(refreshPort)
}

const baseConfig = {
  define: {
    ['process.env.NODE_ENV']: `"${env}"`,
    ['process.env.REFRESH_PORT']: refreshPort
  },
  bundle: true,
  sourcemap: isProduction ? false : 'inline',
  incremental: !isProduction,
  logLevel: 'error',
  minify: isProduction,
  plugins: [
    fileLastModifiedPlugin(),
    postCssPlugin({
      plugins: [
        postcssImport(),
        postcssUrl([
          { filter: '**/*.svg', url: 'inline' },
          { filter: '**/*.ttf', url: 'inline' }
        ]),
        autoprefixer({
          flexbox: !isProduction,
          overrideBrowserslist: 'last 4 version' //isProduction ? 'last 4 version' : 'last 1 version'
        })]
    }),
    aliasPlugin({
      'hooks': './src/app/hooks',
      'components': './src/app/components',
      'helpers': './src/helpers'
    })
  ]
}

// Server
const buildServer = () => esbuild.build({
  ...baseConfig,
  platform: 'node',
  outdir: './dist/server',
  entryPoints: ['./src/server/index.ts'],
  external: ['firebase*'] // don't bundle firebase packages (fix unexpected state) some code can't be bundle
})

// Client (browser)
const buildClient = () => esbuild.build({
  ...baseConfig,
  platform: 'browser',
  outdir: './dist/client',
  entryPoints: ['./src/app/client.tsx'],
})

const build = () => Promise.all([buildClient(), buildServer()])
copyfiles(['package.json', './dist/server'], {}, () => console.log('package.json copied to dist/server'))
copyfiles(['./static/**/*', './dist/client/static'], { up: 1 }, () => console.log('/static copied to dist/client'))

if (!isProduction) {
  const watcher = chokidar.watch('src', { ignoreInitial: true })
  watcher.on('ready', async () => {
    // Initial build/bundle
    console.log('Building...')
    const [esBuildClient, esBuildServer] = await build()
    console.log('Done')

    // Listening to changes
    console.log('Listening to change')

    let watchTimeoutId
    watcher.on('change', () => {
      if (watchTimeoutId) clearTimeout(watchTimeoutId)

      // Make sure there is not a bunch of edit at the same time
      watchTimeoutId = setTimeout(async () => {
        console.log('Rebuilding...')
        try {
          await Promise.all([esBuildClient.rebuild(), esBuildServer.rebuild()])
        } catch (err) {
          console.log(err)
        }

        bundleEmitter.emit('rebuild')
        console.log('Done')
      }, 500)
    })
  })
} else {
  (async () => {
    console.log('Building...')
    await build()
    console.log('Done')
  })()
}
