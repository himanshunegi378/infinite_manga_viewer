import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'

const checkVisbility = (element: HTMLElement, offset: number): boolean => {
  const position = element.getBoundingClientRect()
  if (
    (position.top - offset < window.innerHeight &&
      position.top - offset >= 0) ||
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
  ref: RefObject<HTMLElement>,
  offset = 0,
  updateInterval = 100
): [boolean, () => void,()=>void] {
  const [isVisible, setIsVisible] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [clickObservalble, setClickObservalble] = useState(null)

  useEffect(() => {
    setClickObservalble(
      fromEvent(window, 'scroll').pipe(throttle(ev => interval(updateInterval)))
    )
  }, [updateInterval])

  useEffect(() => {
    if (checkVisbility(ref.current, offset)) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [offset, ref])

  useEffect(() => {
    if (isDisabled || !clickObservalble) return

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

    const scrollObserver = clickObservalble.subscribe(() => {
      onScroll()
    })
    return () => {
      scrollObserver.unsubscribe()
    }
  }, [clickObservalble, isDisabled, isVisible, offset, ref])

  const disable = useCallback((): void => {
    setIsDisabled(true)
  }, [])

  const enable = useCallback((): void => {
    setIsDisabled(false)
  }, [])

  return [isVisible, disable,enable]
}
