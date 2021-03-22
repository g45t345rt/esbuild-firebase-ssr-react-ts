import React, { RefObject } from 'react'

export default (ref: RefObject<HTMLElement>, handler: () => void, dep?: boolean): void => {
  React.useEffect(() => {
    const { current: templateElement } = ref

    const handleOutsideClick = (e) => {
      const target = e.target as Node
      if (templateElement && !templateElement.contains(target)) handler()
    }

    // register event only if dropdown is opened (avoid populating dom with unused global events)
    if (!dep) window.addEventListener('click', handleOutsideClick)
    return () => {
      if (!dep) window.removeEventListener('click', handleOutsideClick)
    }
  }, [dep])
}
