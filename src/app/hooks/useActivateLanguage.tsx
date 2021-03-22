import { I18n } from '@lingui/core'
import useAcceptLanguage from './useAcceptLanguage'
import useCookie from './useCookie'

export default (i18n: I18n): void => {
  let [lang] = useCookie('lang', null)
  // if no language cookie use browser language
  if (!lang) lang = useAcceptLanguage(['en', 'fr'], 'en')

  i18n.activate(lang)
}
