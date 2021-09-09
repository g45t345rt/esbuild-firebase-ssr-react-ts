import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import useFirebaseCookie from './useFirebaseCookie'

export type ThemeContext = {
  theme?: string
  setTheme?: (name: string) => void
}

const Context = React.createContext<ThemeContext>({})

type ThemeProviderProps = {
  children: ReactNode,
  defaultTheme: string
}

export const ThemeProvider = ({ children, defaultTheme }: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = useFirebaseCookie('theme', defaultTheme)

  return <Context.Provider value={{ theme, setTheme }}>
    <Helmet htmlAttributes={{ class: `theme-${theme}` }} />
    {children}
  </Context.Provider>
}

export default (): ThemeContext => React.useContext(Context)
