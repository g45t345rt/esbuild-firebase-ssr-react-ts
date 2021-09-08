import React from 'react'
import { StaticRouter } from 'react-router-dom'

import App from './index'
import { ServerFuncProvider, ServerFuncContext } from 'hooks/useServerFunc'
import { ServerContext, ServerProvider } from 'hooks/useServer'

export interface ServerAppProps {
  serverContext: ServerContext
  serverFuncContext: ServerFuncContext
}

export default (props: ServerAppProps): JSX.Element => {
  const { serverContext, serverFuncContext } = props
  const { req } = serverContext
  return <ServerFuncProvider context={serverFuncContext} >
    <ServerProvider context={serverContext}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </ServerProvider>
  </ServerFuncProvider>
}
