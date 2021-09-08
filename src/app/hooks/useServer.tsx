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
  context: ServerContext
}

export const ServerProvider = ({ children, context }: ServerProviderProps): JSX.Element => {
  context.res.status(200) // set to 200 by default... important when we render app multiple times based on authentication

  return <Context.Provider value={context}>
    {children}
  </Context.Provider>
}
