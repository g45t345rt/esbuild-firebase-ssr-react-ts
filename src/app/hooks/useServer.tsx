import React, { ReactNode } from 'react'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export type ServerContext = {
  req: FastifyRequest
  res: FastifyReply
  app: FastifyInstance
}

const Context = React.createContext<ServerContext>(null)

export default (): ServerContext => React.useContext<ServerContext>(Context)

type ServerProviderProps = {
  children: ReactNode
  server: ServerContext
}

export const ServerProvider = ({ children, server }: ServerProviderProps): JSX.Element => {
  return <Context.Provider value={server}>
    {children}
  </Context.Provider>
}
