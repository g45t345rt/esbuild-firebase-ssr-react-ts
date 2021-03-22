import { auth } from 'firebase-admin'

declare global {
  const __fileLastModified__: number
}

declare module 'fastify' {
  interface FastifyInstance {
    auth: auth.Auth
    firestore: FirebaseFirestore.Firestore
  }

  interface FastifyRequest {
    claims: auth.DecodedIdToken
  }
}
