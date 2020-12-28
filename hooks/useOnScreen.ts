import { useCallback, useEffect, useRef, useState } from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'

const checkVisbility = (element: any, offset: number): boolean => {
  const position = element.getBoundingClientRect()
  if (
    //@ts-ignore
    (position.top - offset < window.innerHeight &&
      position.top - offset >= 0) ||
    //@ts-ignore
    (position?.bottom + offset < window.innerHeight &&
      position?.bottom + offset >= 0) ||
    (position.top - offset < window.innerHeight &&
      position.bottom + offset > window.innerHeight)
  ) {
    return true
  } else {
    return false
  }
}
export default function useOnScreen(
  ref: any,
  offset: number,
  updateInterval: number = 100
): [boolean, () => void] {
  const [isVisible, setIsVisible] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const clickObservalbleRef = useRef(
    fromEvent(window, 'scroll').pipe(throttle(ev => interval(updateInterval)))
  )

  useEffect(() => {
    if (checkVisbility(ref.current, offset)) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [offset, ref])

  useEffect(() => {
    if (isDisabled) return

    const onScroll = () => {
      if (!ref.current) {
        return
      }
      if (checkVisbility(ref.current, offset)) {
        if (!isVisible) {
          setIsVisible(true)
        }
      } else {
        if (isVisible) {
          setIsVisible(false)
        }
      }
    }

    const scrollObserver = clickObservalbleRef.current.subscribe(() => {
      onScroll()
    })
    return () => {
      scrollObserver.unsubscribe()
    }
  }, [isDisabled, isVisible, offset, ref])

  const disable = useCallback((): void => {
    setIsDisabled(true)
  }, [])

  return [isVisible, disable]
}
