import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { fromEvent, interval } from 'rxjs'
import { throttle } from 'rxjs/operators'
import useObservable from './useObservable'

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
  updateInterval = 100,
  isEnabled = true
): [boolean] {
  const [isVisible, setIsVisible] = useState(false)
  // const [isDisabled, setIsDisabled] = useState(false)

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
    if (checkVisbility(ref.current, offset)) {
      if (!isVisible) {
        setIsVisible(true)
      }
    } else {
      if (isVisible) {
        setIsVisible(false)
      }
    }
  }, [isVisible, offset, ref])

  const [subscribe, unsubscribe] = useObservable(observable, observer)

  useEffect(() => {
    if (isEnabled) {
      subscribe()
    } else {
      unsubscribe()
    }
  }, [isEnabled, subscribe, unsubscribe])

  useEffect(() => {
    if (checkVisbility(ref.current, offset)) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [offset, ref])

  return [isVisible]
}

function useOnscreenEffect(
  cb: () => void,
  ref: RefObject<HTMLElement>,
  updateInterval = 100,
  offset = 0,
  isEnabled = true
): void {
  const [isVisible, setIsVisible] = useState(false)
  const cbRef = useRef<() => void>()

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
    if (checkVisbility(ref.current, offset)) {
      if (!isVisible) {
        setIsVisible(true)
      }
    } else {
      if (isVisible) {
        setIsVisible(false)
      }
    }
  }, [isVisible, offset, ref])

  const [subscribe, unsubscribe] = useObservable(observable, observer)

  useEffect(() => {
    cbRef.current = cb
  }, [cb])

  useEffect(() => {
    if (isEnabled) {
      subscribe()
    } else {
      unsubscribe()
    }
  }, [isEnabled, subscribe, unsubscribe])

  useEffect(() => {
    if (isVisible && isEnabled) {
      cbRef.current()
    }
  }, [isEnabled, isVisible])
}

export { useOnscreenEffect }
