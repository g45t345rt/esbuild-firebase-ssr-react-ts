import * as functions from 'firebase-functions'
import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyCORS from 'fastify-cors'
import fastifyFormBody from 'fastify-formbody'
import fastifyMultipart from 'fastify-multipart'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import firebaseAdmin from 'firebase-admin'

import template from './template'
import ServerApp from '../app/server'

const admin = firebaseAdmin.initializeApp()

const auth = admin.auth()
const firestore = admin.firestore()

// Initialize fastify handler
const app = fastify({ logger: { level: 'debug' } })

// Declare server context
app.decorate('auth', auth)
app.decorate('firestore', firestore)

// Fix POST not handle https://github.com/fastify/fastify/issues/946#issuecomment-766319521
app.addContentTypeParser('application/json', {}, (req, res, done) => {
  done(null, res['body'])
})

// Register middleware
app.register(fastifyCORS)
app.register(fastifyCookie)
app.register(fastifyFormBody)
app.register(fastifyMultipart)

app.get('*', async (req, res) => {
  const serverDataContext = { promises: [] }
  const serverContext = { req, res, app }
  const element = createElement(ServerApp, { serverContext, serverDataContext })
  renderToString(element)
  await Promise.all(serverDataContext.promises)
  Reflect.deleteProperty(serverDataContext, 'promises')
  //delete serverDataContext.promises

  const helmet = Helmet.renderStatic()
  const body = renderToString(element)

  res.type('text/html')
  return template({ body, helmet, data: serverDataContext })
})

export const request = functions.https.onRequest(async (req, res) => {
  await app.ready()
  app.server.emit('request', req, res)
})
