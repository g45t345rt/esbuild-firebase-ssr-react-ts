export default (resizeStart: () => void, resizeEnd: () => void): void => {
  if (typeof window === undefined) return

  const { addEventListener, setTimeout, clearTimeout } = window

  let timeoutId = null
  addEventListener('resize', () => {
    if (timeoutId) clearTimeout(timeoutId)
    else resizeStart()

    timeoutId = setTimeout(() => {
      timeoutId = null
      resizeEnd()
    }, 500)
  })
}
