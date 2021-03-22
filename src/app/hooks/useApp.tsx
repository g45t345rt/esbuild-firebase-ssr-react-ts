import React, { ReactNode, useEffect } from 'react'
import firebase from 'firebase/app'
import Cookies from 'js-cookie'

import useServer from './useServer'
import useServerData from './useServerData'

export type AppContext = {
  firestore: firebase.firestore.Firestore
  user: firebase.User
  auth: firebase.auth.Auth
}

const Context = React.createContext<AppContext>(null)

export default (): AppContext => React.useContext<AppContext>(Context)

type AppProviderProps = {
  firebaseApp: firebase.app.App
  children: ReactNode
}

export const AppProvider = ({ children, firebaseApp }: AppProviderProps): JSX.Element => {
  const auth = firebaseApp.auth()
  const firestore = firebaseApp.firestore()

  const server = useServer()

  const [user, setUser] = React.useState<firebase.User>(null)

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser)
    })

    let token
    if (server) {
      token = server.req.cookies['session']
    } else {
      token = Cookies.get('session')
    }

    if (token) {
      const signIn = firebaseApp.auth().signInWithCredential(token).then(data => {
        //setUser(data.user)
        return JSON.parse(JSON.stringify(data.user))
      })

      useServerData('auth_user', null, signIn)
    }
  }, [])

  return <Context.Provider value={{ auth, firestore, user }}>
    {children}
  </Context.Provider>
}
