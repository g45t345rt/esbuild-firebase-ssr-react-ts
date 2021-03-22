import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseConfig from '../../firebaseConfig.json'
if (Object.keys(firebaseConfig).length === 0) {
  throw new Error(`To initializeApp, you need to insert your web app's firebaseConfig in ./src/app/firebaseConfig.json .`)
}

let app = firebase.apps[0]
if (!app) app = firebase.initializeApp(firebaseConfig)

// httponly use cookie and dont persist state on client side
app.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
export default app
