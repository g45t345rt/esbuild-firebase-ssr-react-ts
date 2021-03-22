import React from 'react'
import useServer from './useServer'
import Cookies from 'js-cookie'

export default function useCookie<T>(key: string, initialValue: T): [T, (value: T, opt?: Cookies.CookieAttributes) => void] {
  const server = useServer()
  const [storedValue, setStoredValue] = React.useState(() => {
    if (server) {
      const data = server.req.cookies[key]
      try {
        if (data === undefined) return initialValue
        return JSON.parse(data)
      } catch (err) {
        return data
      }
    }

    const data = Cookies.get(key)
    try {
      if (data === undefined) return initialValue
      return JSON.parse(data)
    } catch (err) {
      return data
    }
  })

  const setValue = (value: T, opt?: Cookies.CookieAttributes) => {
    if (!server) {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      Cookies.set(key, valueToStore, opt)
    }
  }

  return [storedValue, setValue]
}
