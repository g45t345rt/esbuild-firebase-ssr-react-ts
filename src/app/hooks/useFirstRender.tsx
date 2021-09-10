import { useEffect, useRef } from 'react'

// If page or ssr load has been rendered once
let firstPageRender = true
export const usePageRender = (): boolean => {
  useEffect(() => {
    firstPageRender = false
  }, [])

  return firstPageRender
}

// If component has been rendered once
export default (): boolean => {
  const firstRenderRef = useRef<boolean>(true)
  const isFirstRender = firstRenderRef.current

  useEffect(() => {
    firstRenderRef.current = false
  }, [])

  return isFirstRender
}
