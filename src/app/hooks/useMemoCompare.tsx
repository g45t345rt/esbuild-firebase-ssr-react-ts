import React from 'react'

export default function useMemoCompare<T>(next: T, compare: (previous: T, next: T) => boolean): T {
  const previousRef = React.useRef<T>()
  const previous = previousRef.current

  const isEqual = compare(previous, next)

  React.useEffect(() => {
    if (!isEqual) previousRef.current = next
  })

  return isEqual ? previous : next
}
