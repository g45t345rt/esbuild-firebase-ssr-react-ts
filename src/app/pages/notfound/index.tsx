import useServer from 'hooks/useServer'
import React from 'react'

export default (): JSX.Element => {
  const server = useServer()
  if (server) server.res.statusCode = 404

  return <div>
    <h1>404 - Page not found</h1>
    <p>The page you are looking for does not exists!</p>
  </div>
}
