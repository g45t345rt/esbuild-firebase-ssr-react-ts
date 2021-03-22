import React, { ReactNode } from 'react'
import resizeEvent from 'helpers/resizeEvent'

//import styles from './styles.module.less'
import styles from './styles.module.less'

const noTransitionClassName = styles.preventTransition

const addPreventTransition = (element: HTMLElement) => {
  if (!hasPreventTransition(element)) element.classList.add(noTransitionClassName)
}

const delPreventTransition = (element: HTMLElement) => {
  element.classList.remove(noTransitionClassName)
}

const hasPreventTransition = (element: HTMLElement) => {
  return element.classList.contains(noTransitionClassName)
}

export default ({ children }: { children: ReactNode }): JSX.Element => {
  const ref = React.useRef()

  React.useEffect(() => {
    const { current: element } = ref

    // delete class if exists from SSR
    if (hasPreventTransition(element)) delPreventTransition(element)

    // Prevent transition on resize
    const onResizeStart = () => addPreventTransition(element)
    const onResizeEnd = () => delPreventTransition(element)
    resizeEvent(onResizeStart, onResizeEnd)
  }, [])

  return <div ref={ref} className={styles.preventTransition}>
    {children}
  </div>
}
