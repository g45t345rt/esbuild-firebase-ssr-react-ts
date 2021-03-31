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

const bundleEmitter = new EventEmitter()
const argv = yargs(hideBin(process.argv)).argv

const env = argv.env || 'development'
const isProduction = env === 'production'

if (!isProduction) {
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

  server.listen(5645)
}

const baseConfig = {
  define: {
    ['process.env.NODE_ENV']: `"${env}"`
  },
  incremental: !isProduction,
  bundle: true,
  // not using watch onRebuild because it's actually polling every 2 seconds (I only want to website to refresh on file change)
  sourcemap: !isProduction && 'external',
  minify: isProduction,
  metafile: true,
  plugins: [
    fileLastModifiedPlugin(),
    postCssPlugin({
      plugins: [autoprefixer({
        flexbox: !isProduction,
        overrideBrowserslist: isProduction ? 'last 4 version' : 'last 1 version'
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
})

// Client (browser)
const buildClient = () => esbuild.build({
  ...baseConfig,
  platform: 'browser',
  outdir: './dist/client',
  entryPoints: ['./src/app/client.tsx'],
})


const build = () => Promise.all([buildServer(), buildClient()])
copyfiles(['package.json', './dist/server'], {}, () => console.log('package.json copied to dist/server'))
copyfiles(['./src/static/**/*', './dist/client'], { up: 1 }, () => console.log('/static copied to dist/client'))

if (!isProduction) {
  const watcher = chokidar.watch('src', { ignoreInitial: true })
  watcher.on('ready', async () => {
    // Initial build/bundle
    console.log('Building...')
    const [esBuildClient, esBuildServer] = await build()
    console.log('Done')

    // Listening to changes
    console.log('Listening to change')
    watcher.on('change', async () => {
      console.log('Rebuilding...')
      await Promise.all([esBuildClient.rebuild(), esBuildServer.rebuild()])
      bundleEmitter.emit('rebuild')
      console.log('Done')
    })
  })
} else {
  (async () => {
    console.log('Building...')
    await build()
    console.log('Done')
  })()
}
