import * as functions from 'firebase-functions'
import fastify, { FastifyServerOptions } from 'fastify'
import fastifyCORS from 'fastify-cors'
import fastifyFormBody from 'fastify-formbody'
import fastifyMultipart from 'fastify-multipart'
import { createElement } from 'react'
import Helmet from 'react-helmet'
import firebaseAdmin from 'firebase-admin'

import { renderApp } from 'hooks/useServerFunc'
import fastifyFirebaseCookie from './fastifyFirebaseCookie'
import template from './template'
import ServerApp from '../app/server'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099'
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
  process.env['FIREBASE_DATABASE_EMULATOR_HOST'] = 'localhost:9000'
  process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = 'localhost:9199'
}

const admin = firebaseAdmin.initializeApp()

const auth = admin.auth()
const firestore = admin.firestore()

// Initialize fastify handler
const app = fastify({
  logger: isDev
})

// Declare server context
app.decorate('auth', auth)
app.decorate('firestore', firestore)

// Fix POST not handle https://github.com/fastify/fastify/issues/946#issuecomment-766319521
app.addContentTypeParser('application/json', {}, (req, res, done) => {
  done(null, res['body'])
})

// Register middleware
app.register(fastifyCORS)
app.register(fastifyFormBody)
app.register(fastifyMultipart)
app.register(fastifyFirebaseCookie)

// Register master/default route
app.get('*', async (req, res) => {
  const serverFuncContext = { data: {}, funcs: {} }
  const serverContext = { req, res, app }
  const element = createElement(ServerApp, { serverContext, serverFuncContext })

  const body = await renderApp(element, serverFuncContext)
  const helmet = Helmet.renderStatic()
  res.type('text/html')
  return template({ body, helmet, data: serverFuncContext.data })
})

export const request = functions.https.onRequest(async (req, res) => {
  await app.ready()
  app.server.emit('request', req, res)
})
