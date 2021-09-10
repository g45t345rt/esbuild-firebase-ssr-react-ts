import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

import './initFirebase'
import './theme/global/index.sass'

import PreventTransition from 'components/PreventTransition'
import scrollTopOnRouteChange from 'hooks/scrollTopOnRouteChange'
import { ThemeProvider } from 'hooks/useTheme'

// PAGES
import Home from './pages/home'
import NotFound from './pages/notfound'
import SSRFirestore from './pages/ssrFirestore'
import CacheControl from './pages/cachecontrol'

export default (): JSX.Element => {
  scrollTopOnRouteChange()

  return <PreventTransition>
    <ThemeProvider defaultTheme="light">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/client.css" />

        <link rel="apple-touch-icon" sizes="180x180" href="/static/icon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/icon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/icon/favicon-16x16.png" />
        <link rel="manifest" href="/static/icon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/cache-control" exact component={CacheControl} />
        <Route path="/ssr-firestore" exact component={SSRFirestore} />
        <Route component={NotFound} />
      </Switch>
    </ThemeProvider>
  </PreventTransition>
}
