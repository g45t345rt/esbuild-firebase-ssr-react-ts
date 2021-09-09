export default <T>(str: string): T => {
  try {
    const obj = JSON.parse(str)
    if (typeof obj === 'object') return obj
    return {} as T
  } catch {
    return {} as T
  }
}
