import React from 'react'
import { StaticRouter } from 'react-router-dom'

import App from './index'
import { ServerDataProvider, ServerDataContext } from 'hooks/useServerData'
import { ServerContext, ServerProvider } from 'hooks/useServer'

export interface ServerAppProps {
  serverContext: ServerContext
  serverDataContext: ServerDataContext
}

export default (props): JSX.Element => {
  const { serverContext, serverDataContext } = props
  const { req } = serverContext
  return <ServerDataProvider data={serverDataContext} >
    <ServerProvider server={serverContext}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </ServerProvider>
  </ServerDataProvider>
}
