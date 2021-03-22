import { i18n } from '@lingui/core'
import { en, fr } from 'make-plural/plurals'

import { messages as enMessages } from '../locales/en/messages'
import { messages as frMessages } from '../locales/fr/messages'

i18n.loadLocaleData({
  en: { plurals: en },
  fr: { plurals: fr }
})

i18n.load('en', enMessages)
i18n.load('fr', frMessages)

export default i18n
