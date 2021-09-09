import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet'

export type ThemeContext = {
  theme?: string
  setTheme?: (name: string) => void
}

const Context = React.createContext<ThemeContext>({})

type ThemeProviderProps = {
  children: ReactNode,
  name: string
}

export const ThemeProvider = ({ children, name }: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = React.useState(name)

  return <Context.Provider value={{ theme, setTheme }}>
    <Helmet htmlAttributes={{ class: theme }} />
    {children}
  </Context.Provider>
}

export default (): ThemeContext => React.useContext(Context)
