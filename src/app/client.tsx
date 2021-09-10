import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './index'
import { getServerFuncClientContext, ServerFuncProvider } from 'hooks/useServerFunc'

const serverFuncContext = getServerFuncClientContext()
const rootElement = document.getElementById('root')
const client = (
  <ServerFuncProvider context={serverFuncContext}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ServerFuncProvider>
)

if (process.env.NODE_ENV === 'production') {
  ReactDOM.hydrate(client, rootElement) // perserve markup and only attach event handlers (performant first-load)
} else {
  ReactDOM.render(client, rootElement)

  if (process.env.REFRESH_PORT) {
    const evtSource = new EventSource(`http://localhost:${process.env.REFRESH_PORT}`)

    evtSource.addEventListener('refresh', () => {
      console.log('refresh')
      window.location.reload()
    })
  } else console.warn('Missing refresh port. App will not reload after edit!')
}
