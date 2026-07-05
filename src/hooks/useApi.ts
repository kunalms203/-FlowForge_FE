import { useState, useEffect, useCallback } from 'react'
import { AxiosResponse } from 'axios'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  apiCall: () => Promise<AxiosResponse<{ data: T }>>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await apiCall()
      setState({
        data: response.data.data,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.response?.data?.message || error.message || 'An error occurred',
      })
    }
  }, [apiCall])

  useEffect(() => {
    execute()
  }, [...dependencies])

  return { ...state, refetch: execute }
}

export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<AxiosResponse<{ data: T }>>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (variables: V) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const response = await mutationFn(variables)
        setState({
          data: response.data.data,
          loading: false,
          error: null,
        })
        return response.data.data
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        })
        throw error
      }
    },
    [mutationFn]
  )

  return { ...state, mutate }
}
