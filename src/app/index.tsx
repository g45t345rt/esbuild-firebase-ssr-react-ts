import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { I18nProvider } from '@lingui/react'
import { Helmet } from 'react-helmet'

import i18n from './initI18n'
import firebaseApp from './initFirebase'

import { AppProvider } from 'hooks/useApp'
import useActivateLanguage from 'hooks/useActivateLanguage'
import PreventTransition from 'components/PreventTransition'

import styles from './index.module.less'

// PAGES
import Home from './pages/home'

export default (): JSX.Element => {
  useActivateLanguage(i18n)

  return <PreventTransition>
    <AppProvider firebaseApp={firebaseApp}>
      <I18nProvider i18n={i18n}>
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
        <div className={styles.container}>
          This is a container
        </div>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </I18nProvider>
    </AppProvider>
  </PreventTransition>
}
