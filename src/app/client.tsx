import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './index'
import { ServerDataProvider } from 'hooks/useServerData'

let data = {}
if (window && window['initialData']) {
  data = window['initialData']
}

const rootElement = document.getElementById('root')
const client = (
  <ServerDataProvider data={data}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ServerDataProvider>
)

if (process.env.NODE_ENV === 'production') {
  ReactDOM.hydrate(client, rootElement) // perserve markup and only attach event handlers (performant first-load)
} else {
  ReactDOM.render(client, rootElement)
}

const evtSource = new EventSource('http://localhost:5645')

evtSource.addEventListener('refresh', () => {
  console.log('refresh')
  window.location.reload()
})
