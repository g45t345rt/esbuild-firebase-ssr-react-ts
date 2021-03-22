import React, { Dispatch, SetStateAction } from 'react'

export default (initialValue = true): [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [hidden, setHidden] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setHidden((currentHidden) => !currentHidden)
  }, [])

  return [hidden, toggle, setHidden]
}
