import { useCallback, useEffect, useRef } from 'react'

function useForCompleteExecutionEffect<T>(cb) {
  const callabckRef = useRef<() => T>()
  const isExecuting = useRef(false)

  useEffect(() => {
    callabckRef.current = cb
  }, [cb])

  return useCallback(async () => {
    if (isExecuting.current) return
    isExecuting.current = true
    const returnValue = await callabckRef.current()
    isExecuting.current
  }, [])
}

export default useForCompleteExecutionEffect
