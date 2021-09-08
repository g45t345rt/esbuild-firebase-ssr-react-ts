type SubmitReducerState = {
  [id: string]: unknown
  loading: boolean
  err?: unknown
}

type Action = {
  type: string
  value: unknown
}

export default (state: SubmitReducerState, action: Action): SubmitReducerState => {
  switch (action.type) {
    case 'err':
      return { ...state, loading: false, err: action.value }
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return { ...state, loading: false, err: null }
  }
}
