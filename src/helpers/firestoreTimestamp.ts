type FirestoreTimestamp = {
  seconds: number
  nanoseconds: number
}

export default (timestamp: FirestoreTimestamp): number => {
  const { seconds, nanoseconds } = timestamp
  const milliseconds = seconds * 1000 + nanoseconds / 1000000
  return milliseconds
}
