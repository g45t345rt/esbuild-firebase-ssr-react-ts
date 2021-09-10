import React from 'react'
import dayjs from 'dayjs'
import { collection, getFirestore, query, getDocs, addDoc, onSnapshot, deleteDoc, doc, limit } from 'firebase/firestore'

import useServerFunc from 'hooks/useServerFunc'
import useTheme from 'hooks/useTheme'

import styles from './styles.module.sass'
import { Link } from 'react-router-dom'

const firestore = getFirestore()
const listRef = collection(firestore, 'list')

const lastModified = __fileLastModified__

export default (): JSX.Element => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }, [theme])

  return <div>
    <h1 className={styles.title}>Website template / boilerplate - Home page</h1>
    <h2>Features</h2>
    <ul>
      <li>React with hooks and context (no redux)</li>
      <li>Firebase hosting (ready to deploy in one command)</li>
      <li>SSR / Server side rendering for SEO (works with async fetch functions)</li>
      <li>Fast build (esbuild / native code)</li>
      <li>CSS Modules (sass)</li>
    </ul>
    <h2>ThemeProvider</h2>
    <p>Simple usage of useTheme() with light & dark theme. Works by setting class attribute on html tag.</p>
    <button onClick={toggleTheme}>Toggle theme</button>
    <h2>esbuild-plugin-filelastmodified</h2>
    <p>Using esbuild plugin to get the file modication date</p>
    <div className="card">{dayjs(lastModified).format('LLL')}</div>
    <h2>SSR Firestore</h2>
    <Link to="/ssr-firestore">Go to page</Link>
  </div>
}
