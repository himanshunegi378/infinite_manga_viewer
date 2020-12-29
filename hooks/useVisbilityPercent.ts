import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'

// const checkVisbility = (element: HTMLElement, offset = 0): boolean => {
//   const position = element.getBoundingClientRect()
//   if (
//     (position.top - offset < window.innerHeight &&
//       position.top - offset >= 0) ||
//     (position?.bottom + offset < window.innerHeight &&
//       position?.bottom + offset >= 0) ||
//     (position.top - offset < window.innerHeight &&
//       position.bottom + offset > window.innerHeight)
//   ) {
//     return true
//   } else {
//     return false
//   }
// }

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
    (position.top < 0 &&
      position.bottom > window.innerHeight) ||
    inViewPort(element)
  ) {
    return 100
  } else {
    if (position?.bottom < window.innerHeight && position?.bottom >= 0) {
      const visbilityPercentage = (position.bottom / window.innerHeight) * 100
      console.log('bottom visible')
      return visbilityPercentage
    } else {
      if (position.top < window.innerHeight && position.top >= 0) {
        const visbilityPercentage =
          ((window.innerHeight - position.top) / window.innerHeight) * 100
      console.log('top visible')

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
  const clickObservalbleRef = useRef(
    fromEvent(window, 'scroll').pipe(throttle(() => interval(updateInterval)))
  )

  useEffect(() => {
    setVisiblePercent(getVisbilityPercentage(ref.current))
  }, [ref])

  useEffect(() => {
    if (isDisabled) return
    if (!ref.current) {
      return
    }
    const onScroll = () => {
      setVisiblePercent(getVisbilityPercentage(ref.current))
    }

    const scrollObserver = clickObservalbleRef.current.subscribe(() => {
      onScroll()
    })
    return () => {
      scrollObserver.unsubscribe()
    }
  }, [isDisabled, ref])

  const disable = useCallback((): void => {
    setIsDisabled(true)
  }, [])

  return [visiblePercent, disable]
}
