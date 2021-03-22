import React from 'react'

export type StackTemplateFuncProps = { close: () => void, add: StackAddFunc }
export type StackTemplateFunc = (props: StackTemplateFuncProps) => JSX.Element

type StachAddProps = { duration?: number, closeDelay?: number, type: string }
type StackAddFunc = (templateFunc: StackTemplateFunc, opts?: StachAddProps) => void

const reducer = (elements, action) => {
  if (action.type === 'push') return [...elements, action.data]
  if (action.type === 'pop') return [action.data, ...elements]
  if (action.type === 'del') return [...elements.filter((n) => n.key !== action.key)]
  if (action.type === 'closing') return [...elements.map((n) => {
    if (n.key === action.key) return React.cloneElement(n, { ['data-closing']: true })
    return n
  })]
  return elements
}

export default (props?: StachAddProps): [JSX.Element[], StackAddFunc] => {
  let { duration, closeDelay, type = 'push' } = props || {}
  const [elements, dispatch] = React.useReducer(reducer, [])

  const add = React.useCallback<StackAddFunc>((templateFunc, opts) => {
    if (opts) {
      duration = opts.duration
      closeDelay = opts.closeDelay
      type = opts.type
    }

    const key = Date.now().toString()

    const close = () => {
      dispatch({ type: 'closing', key })
      if (closeDelay) {
        window.setTimeout(() => dispatch({ type: 'del', key }), closeDelay)
      } else
        dispatch({ type: 'del', key })
    }

    if (duration && duration > 0) {
      window.setTimeout(close, duration)
    }

    const newElement = templateFunc({ close, add })
    dispatch({ type, data: React.cloneElement(newElement, { key }) })
  }, [props])

  return [elements, add]
}
