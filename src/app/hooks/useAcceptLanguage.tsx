import parser from 'accept-language-parser'

import useServer from './useServer'
import useServerData from './useServerData'

export default (pick: string[], defaultLanguage: string): string => {
  const server = useServer()

  return useServerData<string>('lang', defaultLanguage, new Promise((resolve) => {
    if (server) {
      const { req } = server
      const acceptLanguage = req.headers["accept-language"]
      const userLang = parser.pick(pick, acceptLanguage)
      resolve(userLang)
    }
  }))
}
