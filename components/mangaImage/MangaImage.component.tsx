import { resolveHref } from 'next/dist/next-server/lib/router/router'
import { type } from 'os'
import React, {
  SyntheticEvent,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import useEffectDebugger from '../../hooks/useEffectDebug'
import useOnScreen from '../../hooks/useOnScreen'

const initialControlState: ControlState = {
  throttlValue: 100,
  retryLimit: 3,
  retryInterval: 500
}

type ControlState = {
  throttlValue: number
  retryLimit: number
  retryInterval: number
  imageLoadDelay: number
}
type Action =
  | { type: 'updateThrottleValue'; throttleValue: number }
  | { type: 'updateRetryLimit'; retryLimit: number }
  | { type: 'updateRetryInterval'; retryInterval: number }
  | { type: 'updateImageLoadDelay'; imageLoadDelay: number }

function reducer(state: ControlState, action: Action): ControlState {
  switch (action.type) {
    case 'updateThrottleValue':
      return Object.assign(state, {
        throttleValue: action.throttleValue
      })
    case 'updateRetryLimit':
      return Object.assign(state, {
        retryLimit: action.retryLimit
      })
    case 'updateRetryInterval':
      return Object.assign(state, {
        retryInterval: action.retryInterval
      })
    case 'updateImageLoadDelay':
      return Object.assign(state, {
        retryInterval: action.imageLoadDelay
      })
    default:
      return Object.assign(state)
  }
}

function MangaImage(props: any) {
  const { imageLink, visibilityDetection = true } = props
  const [
    { retryInterval, retryLimit, throttlValue, imageLoadDelay },
    dispatch
  ] = useReducer(reducer, initialControlState)
  const [isActive, setIsActive] = useState(false)
  const [err, setErr] = useState(false)
  const NoOfTimesRetried = useRef(0)
  const ref = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isVisible, disable, enable] = useOnScreen(ref, 100, throttlValue)

  useEffect(() => {
    visibilityDetection === true ? enable() : disable()
  }, [disable, enable, visibilityDetection])

  /** Start timer when counter container is visbile
   * reset the timer if visibilty changes to invisible
   * disable visibility detection once timer is completed
   */
  useEffect(() => {
    let id = -1

    if (isVisible) {
      id = window.setTimeout(() => {
        setIsActive(true)
        disable()
      }, imageLoadDelay)
    }
    return () => {
      window.clearTimeout(id)
    }
  }, [disable, imageLoadDelay, isVisible])

  const onImageLoaded = () => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
  }

  const onError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!NoOfTimesRetried) return
    if (NoOfTimesRetried.current <= retryLimit) {
      setTimeout(() => {
        NoOfTimesRetried.current += 1
        retry()
      }, retryInterval * NoOfTimesRetried.current)
    } else {
      setErr(true)
    }
  }

  const retry = () => {
    setErr(false)
    if (!imageRef.current) return
    imageRef.current.src = ''
    imageRef.current.src = imageLink
  }

  return (
    <div
      ref={ref}
      style={{
        height: '500px'
      }}>
      {err ? (
        <div className=" flex flex-wrap justify-center content-center h-full">
          <button
            className="bg-blue-500 px-4 py-2 rounded-md font-semibold text-lg text-white"
            onClick={retry}>
            Retry
          </button>
        </div>
      ) : null}
      {isActive ? (
        <img
          ref={imageRef}
          data-testid="mangaImage"
          style={{
            verticalAlign: 'bottom',
            width: '100%',
            height: 'auto'
          }}
          src={imageLink}
          onLoad={onImageLoaded}
          onError={onError}
          referrerPolicy="no-referrer"
          alt="l"
        />
      ) : (
        <img
          data-testid="fallbackImage"
          src="/loading.gif"
          width="128"
          height="128"
        />
      )}
    </div>
  )
}

export default MangaImage
