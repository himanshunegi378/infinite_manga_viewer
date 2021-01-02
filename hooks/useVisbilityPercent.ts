import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'
import useObservable from './useObservable'

function inViewPort(element: HTMLElement) {
  const position = element.getBoundingClientRect()
  const topInViewport = position.top > 0 && position.top < window.innerHeight
  const bottomInViewPort =
    position.bottom > 0 && position.bottom < window.innerHeight
  return !!(topInViewport && bottomInViewPort)
}

const getVisbilityPercentage = (element: HTMLElement) => {
  const position = element.getBoundingClientRect()
  if (
    (position.top < 0 && position.bottom > window.innerHeight) ||
    inViewPort(element)
  ) {
    return 100
  } else {
    if (position?.bottom < window.innerHeight && position?.bottom >= 0) {
      const visbilityPercentage = (position.bottom / window.innerHeight) * 100
      return visbilityPercentage
    } else {
      if (position.top < window.innerHeight && position.top >= 0) {
        const visbilityPercentage =
          ((window.innerHeight - position.top) / window.innerHeight) * 100

        return visbilityPercentage
      }
    }
  }
  return 0
}

export default function useVisibilityPercent(
  ref: RefObject<HTMLElement>,
  updateInterval = 100
): [number, () => void] {
  const [visiblePercent, setVisiblePercent] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [clickObservalble, setClickObservalble] = useState(null)

  const observable = useMemo(
    () =>
      fromEvent(window, 'scroll').pipe(
        throttle(() => interval(updateInterval))
      ),
    [updateInterval]
  )

  const observer = useCallback(() => {
    if (!ref.current) {
      return
    }
    setVisiblePercent(getVisbilityPercentage(ref.current))
  }, [ref])

  const [subscribe, unsubscribe] = useObservable(observable, observer)

  useEffect(() => {
    if (isDisabled) {
      unsubscribe()
    } else {
      subscribe()
    }
  }, [isDisabled, subscribe, unsubscribe])

  useEffect(() => {
    if (!ref.current) return
    setVisiblePercent(getVisbilityPercentage(ref.current))
  }, [ref])

  // useEffect(() => {
  //   if (isDisabled || !clickObservalble) return
  //   if (!ref.current) {
  //     return
  //   }
  //   const onScroll = () => {
  //     setVisiblePercent(getVisbilityPercentage(ref.current))
  //   }

  //   const scrollObserver = clickObservalble.subscribe(() => {
  //     onScroll()
  //   })
  //   return () => {
  //     scrollObserver.unsubscribe()
  //   }
  // }, [clickObservalble, isDisabled, ref])

  const disable = useCallback((): void => {
    setIsDisabled(true)
  }, [])

  return [visiblePercent, disable]
}
