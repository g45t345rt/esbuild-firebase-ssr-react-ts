import React, { ReactNode } from 'react'

export type ServerDataContext = {
  promises?: Promise<unknown>[]
}

const Context = React.createContext<ServerDataContext>({})

export const ServerDataProvider = ({ children, data }: { children: ReactNode, data: ServerDataContext }): JSX.Element => {
  return <Context.Provider value={data}>
    {children}
  </Context.Provider>
}

export default function useServerData<T>(key: string, initial: T, promise: Promise<unknown>): T {
  const context = React.useContext(Context)

  if (context.promises) {
    // Push promises so server can wait for all promises
    context.promises.push(promise.then(data => {
      // intercept promise result
      context[key] = data
    }))
  }

  return context[key] || initial
}
