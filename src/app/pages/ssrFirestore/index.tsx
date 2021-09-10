import React from 'react'
import * as faker from 'faker'
import { collection, getFirestore, query, addDoc, onSnapshot, deleteDoc, getDocs, limit, doc, serverTimestamp, orderBy } from 'firebase/firestore'

import useServerFunc from 'hooks/useServerFunc'
import dayjs from 'dayjs'
import firestoreTimestamp from 'helpers/firestoreTimestamp'
import { usePageRender } from 'hooks/useFirstRender'

const firestore = getFirestore()
const collectionName = 'items'
const itemsRef = collection(firestore, collectionName)

export default (): JSX.Element => {
  const isPageRender = usePageRender()
  const queryItems = query(itemsRef, orderBy('createdAt', 'desc'), limit(10))

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
        const { doc, type } = change
        const data = doc.data()
        if (!data.createdAt) data.localCreatedAt = new Date()

        if (type === 'added') {
          if (items.find((item) => item.id === doc.id)) return
          setItem((state) => [{ id: doc.id, ...data }, ...state])
        }

        if (type === 'removed') {
          setItem((state) => state.filter((item) => item.id !== change.doc.id))
        }
      })
    })

    return unsubscribe // Don't forget to unsubcribe the event during unmount!
  }, [])

  // Display data
  return <div>
    <h1>SSR Firestore</h1>
    <p>Firestore request with server side rendering</p>
    <button onClick={addItem}>Add item</button>
    <button onClick={delItem}>Del item</button>
    {loading && <div>Loading...</div>}
    <div className="grid">
      {items.map((item) => {
        const { name, createdAt, localCreatedAt } = item

        return <div className="card">
          <div>{name}</div>
          <div>{dayjs(createdAt ? firestoreTimestamp(createdAt) : localCreatedAt).format('LL LTS')}</div>
        </div>
      })}
    </div>
  </div>
}
