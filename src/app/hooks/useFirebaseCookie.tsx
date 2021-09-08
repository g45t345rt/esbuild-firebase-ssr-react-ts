import React from 'react'
import useServer from './useServer'
import Cookies from 'js-cookie'
import parseObjString from 'helpers/parseObjString'

const FIREBASE_COOKIE_NAME = '__session'

export default function useFirebaseCookie<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const server = useServer()
  const [storedValue, setStoredValue] = React.useState(() => {
    if (server) {
      const data = server.req.firebaseCookies[key]
      if (data === undefined) return initialValue
      return data as T
    }

    const cookie = Cookies.get(FIREBASE_COOKIE_NAME)
    const data = parseObjString(cookie)
    if (data === undefined) return initialValue
    return data[key] as T
  })

  const setValue = (value: T) => {
    if (!server) {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      const cookie = Cookies.get(FIREBASE_COOKIE_NAME)
      const data = parseObjString(cookie)
      data[key] = valueToStore

      Cookies.set(FIREBASE_COOKIE_NAME, JSON.stringify(data), { path: '/' })
    }
  }

  return [storedValue, setValue]
}
