import React from 'react'
import { Trans, useLingui } from '@lingui/react'
import dayjs from 'dayjs'
import useCookie from 'hooks/useCookie'

const lastModified = __fileLastModified__

export default (): JSX.Element => {
  const { i18n } = useLingui()
  const [, setCookieLang] = useCookie('lang', null)

  const toggleLanguage = React.useCallback(() => {
    const newLang = i18n.locale === 'en' ? 'fr' : 'en'
    setCookieLang(newLang)
    i18n.activate(newLang)
  }, [])

  return <div>
    <button onClick={toggleLanguage}>Toggle language</button>
    <h1><Trans id="This is home" /></h1>
    <div>{dayjs(lastModified).format()}</div>
  </div>
}
