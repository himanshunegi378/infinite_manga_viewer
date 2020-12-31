import { resolveHref } from 'next/dist/next-server/lib/router/router'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import useEffectDebugger from '../../hooks/useEffectDebug'
import useOnScreen from '../../hooks/useOnScreen'

function MangaImage(props: any) {
  const { imageLink } = props
  const [isActive, setIsActive] = useState(false)
  const [err, setErr] = useState(false)
  const retryLimit = 3
  const NoOfTimesRetried = useRef(0)
  const timeInterval = 500
  const ref = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isVisible, disable] = useOnScreen(ref, 100)

  useEffect(() => {
    let id: number | undefined = -1

    if (isVisible) {
      id = window.setTimeout(() => {
        setIsActive(true)
        disable()
      }, 500)
    }
    return () => {
      window.clearTimeout(id)
    }
  }, [disable, isVisible])

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
      }, timeInterval * NoOfTimesRetried.current)
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
