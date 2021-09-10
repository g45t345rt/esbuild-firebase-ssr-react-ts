import React from 'react'
import { useLocation } from 'react-router-dom'

export default (): void => {
  const location = useLocation()

  React.useEffect(() => {
    // scroll to hash if provided or scroll to 0
    const hashElement = document.getElementById(window.location.hash.replace('#', ''))
    const top = hashElement ? hashElement.offsetTop : 0
    document.body.scrollTop = top // safari
    document.documentElement.scrollTop = top // chrome, firefox, others...
  }, [location])
}
