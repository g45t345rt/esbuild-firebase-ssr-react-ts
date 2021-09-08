import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

import firebaseConfig from '../../firebaseConfig.js'

const app = initializeApp(firebaseConfig)

if (process.env.NODE_ENV === 'development') {
  const firestore = getFirestore()
  const storage = getStorage()
  const auth = getAuth()
  const database = getDatabase()
  const functions = getFunctions(app)

  connectFirestoreEmulator(firestore, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectDatabaseEmulator(database, 'localhost', 9000)
  connectFunctionsEmulator(functions, "localhost", 5001)
}
