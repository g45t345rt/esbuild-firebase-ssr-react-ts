import parser from 'accept-language-parser'

import useServer from './useServer'
import useServerFunc from './useServerFunc'

export default (pick: string[], defaultLanguage: string): string => {
  const server = useServer()
  return useServerFunc<string>('lang', () => {
    const { req } = server
    const acceptLanguage = req.headers["accept-language"]
    return parser.pick(pick, acceptLanguage) || defaultLanguage
  })
}
