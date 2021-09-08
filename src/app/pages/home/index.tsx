import React from 'react'
import dayjs from 'dayjs'
import { collection, getFirestore, query, getDocs } from 'firebase/firestore'

import styles from './styles.module.sass'
import useServerFunc from 'hooks/useServerFunc'

const firestore = getFirestore()

const lastModified = __fileLastModified__

export default (): JSX.Element => {

  const list = useServerFunc<string[]>('list', async () => {
    const listRef = collection(firestore, 'list')
    try {
      const snap = await getDocs(query(listRef))
      return snap.docs.map((doc) => doc.data())
    } catch (err) {
      console.log(err)
      return []
    }
  })

  return <div>
    <h1 className={styles.title}>This is home</h1>
    <div>{dayjs(lastModified).format('LLL')}</div>
    {JSON.stringify(list)}
  </div>
}
