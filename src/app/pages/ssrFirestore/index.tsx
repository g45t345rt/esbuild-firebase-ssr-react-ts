import React from 'react'
import * as faker from 'faker'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { collection, getFirestore, query, addDoc, onSnapshot, deleteDoc, getDocs, limit, doc, serverTimestamp, orderBy } from 'firebase/firestore'

import useServerFunc from 'hooks/useServerFunc'
import firestoreTimestamp from 'helpers/firestoreTimestamp'
import { usePageRender } from 'hooks/useFirstRender'
import useLocalStorage from 'hooks/useLocalStorage'

const firestore = getFirestore()
const collectionName = 'items'
const itemsRef = collection(firestore, collectionName)

export default (): JSX.Element => {
  const isPageRender = usePageRender()
  const queryItems = query(itemsRef, orderBy('createdAt', 'desc'), limit(3))

  const [useUTC, setUseUTC] = useLocalStorage('useUTC', true)

  // SSR - Get collection (items) server-side only
  const _items = useServerFunc<[]>('items', async () => {
    try {
      const snap = await getDocs(queryItems)
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.log(err)
      return []
    }
  })

  // Create state to manipulate data (add or remove items)
  const [items, setItem] = React.useState(_items || [])
  const [loading, setLoading] = React.useState(false)

  // Function to add an item
  const addItem = React.useCallback(async () => {
    await addDoc(itemsRef, {
      name: faker.commerce.productName(),
      createdAt: serverTimestamp()
    })
  }, [])

  // Function to remove an item
  const delItem = React.useCallback(async () => {
    const lastItem = items[0]
    if (!lastItem) return
    await deleteDoc(doc(firestore, collectionName, lastItem.id))
  }, [items])

  // Listen to items change client-side only
  React.useEffect(() => {
    !isPageRender && setLoading(true)
    const unsubscribe = onSnapshot(queryItems, (snap) => {
      setLoading(false)
      snap.docChanges().forEach((change) => {
        const { doc, type, newIndex } = change
        const data = doc.data()
        if (!data.createdAt) data.localCreatedAt = new Date()
        const item = { id: doc.id, ...data }

        if (type === 'added') {
          if (items.find(({ id }) => id === item.id)) return
          if (newIndex === 0) setItem((state) => [item, ...state]) // unshift
          if (newIndex >= (items.length - 1)) setItem((state) => [...state, item]) // push
        }

        if (type === 'removed') setItem((state) => state.filter(({ id }) => id !== item.id))
      })
    })

    return unsubscribe // Don't forget to unsubcribe the event during unmount!
  }, [])

  // Display data
  return <div className="grid">
    <h1>SSR Firestore</h1>
    <p>Firestore request with server side rendering</p>
    <ul>
      <li>No loading after http get</li>
      <li>Snapshot on add/delete items - open another tab and changes will be updated</li>
      <li>Server send date in UTC format - use relativeTime to avoid flickering between UTC and client timezone</li>
    </ul>
    <div className="grid-column">
      <div>
        Use UTC
        <input type="checkbox" checked={useUTC} onChange={(e) => setUseUTC(e.target.checked)} />
      </div>
      <button onClick={addItem}>Add item</button>
      <button onClick={delItem}>Del item</button>
    </div>
    {loading && <div>Loading...</div>}
    <div className="grid">
      {items.map((item) => {
        const { id, name, createdAt, localCreatedAt } = item
        const _createdAt = createdAt ? firestoreTimestamp(createdAt) : localCreatedAt
        const createdDate = useUTC ? dayjs(_createdAt).utc() : dayjs(_createdAt)

        return <div key={id} className="card">
          <div>{name}</div>
          <div title={createdDate.format('LL LTS')}>{createdDate.fromNow()}</div>
        </div>
      })}
    </div>
  </div>
}
