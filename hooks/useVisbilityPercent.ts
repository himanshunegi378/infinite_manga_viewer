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
  const [isDisabled, setIsDisabled] = useState(false)

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
    let visibilityPercentage
    try {
      visibilityPercentage = getVisbilityPercentage(ref.current, window)
    } catch (e) {
      console.log('Error while getting visibility percentage: ' + e)
      visibilityPercentage = 0
    }
    setVisiblePercent(visibilityPercentage)
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
    setIsDisabled(true)
  }, [])

  const enable = useCallback((): void => {
    setIsDisabled(false)
  }, [])

  return [visiblePercent, disable, enable]
}
