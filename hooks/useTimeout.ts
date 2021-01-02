import { useEffect, useRef } from 'react'

function useTimeout(callback:()=>void, delay:number):void {
  const savedCallback = useRef<()=>void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useTimeout
