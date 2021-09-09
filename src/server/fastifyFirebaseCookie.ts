import { FastifyPluginCallback, FastifyReply, onRequestHookHandler } from 'fastify'
import cookie, { CookieSerializeOptions } from 'cookie'
import fp from 'fastify-plugin'
import parseObjString from 'helpers/parseObjString'

declare module 'fastify' {
  interface FastifyRequest {
    firebaseCookies: Record<string, unknown>
  }

  interface FastifyReply {
    saveFirebaseCookies: (options?: CookieSerializeOptions) => void
  }
}

// https://firebase.google.com/docs/hosting/manage-cache#using_cookies
const FIREBASE_COOKIE_NAME = '__session'

const fastifyFirebaseCookie: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.decorateReply('saveFirebaseCookies', saveFirebaseCookies)
  fastify.addHook('onRequest', parseFirebaseCookies)

  done()
}

const parseFirebaseCookies: onRequestHookHandler = (req, res, done) => {
  const cookieHeader = req.headers.cookie
  const cookies = cookie.parse(cookieHeader || '')
  const firebaseCookie = cookies[FIREBASE_COOKIE_NAME]
  if (firebaseCookie) req.firebaseCookies = parseObjString(firebaseCookie)
  done()
}

function saveFirebaseCookies(this: FastifyReply, options?: CookieSerializeOptions) {
  const { firebaseCookies } = this.request
  const serialized = cookie.serialize(FIREBASE_COOKIE_NAME, JSON.stringify(firebaseCookies), { path: '/', ...options })
  this.header('Set-Cookie', serialized)
}

export default fp(fastifyFirebaseCookie, { name: 'fastify-firebase-cookie' })
