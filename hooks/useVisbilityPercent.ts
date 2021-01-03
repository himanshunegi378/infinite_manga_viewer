import { RefObject, useCallback, useEffect, useState, useMemo } from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'
import getVisbilityPercentage from '../lib/VisbilityPercentage'
import useObservable from './useObservable'

export default function useVisibilityPercent(
  ref: RefObject<HTMLElement>,
  updateInterval = 100
): [number, () => void, () => void] {
  const [visiblePercent, setVisiblePercent] = useState(0)
  const [isEnabled, setIsEnabled] = useState(true)

  const observable = useMemo(
    () =>
      fromEvent(window, 'scroll').pipe(
        throttle(() => interval(updateInterval), { trailing: true })
      ),
    [updateInterval]
  )

  const observer = useCallback(() => {
    if (!ref.current) {
      return
    }
    let visibilityPercentage
    try {
      visibilityPercentage = getVisbilityPercentage(ref.current, window)
    } catch (e) {
      console.log('Error while getting visibility percentage: ' + e)
      visibilityPercentage = 0
    }
    setVisiblePercent(visibilityPercentage)
  }, [ref])

  const [subscribe, unsubscribe] = useObservable(observable, observer, {
    isEnabled: isEnabled
  })

  // useEffect(() => {
  //   if (isEnabled) {
  //     subscribe()
  //   } else {
  //     unsubscribe()
  //   }
  // }, [isEnabled, subscribe, unsubscribe])

  useEffect(() => {
    if (!ref.current) return

    let visibilityPercentage
    try {
      visibilityPercentage = getVisbilityPercentage(ref.current, window)
    } catch (e) {
      console.log('Error while getting visibility percentage: ' + e)
      visibilityPercentage = 0
    }
    setVisiblePercent(visibilityPercentage)
  }, [ref])

  const disable = useCallback((): void => {
    setIsEnabled(false)
  }, [])

  const enable = useCallback((): void => {
    setIsEnabled(true)
  }, [])

  return [visiblePercent, disable, enable]
}
