import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import useOnScreen from '../../hooks/useOnScreen'
import useVisibilityPercent from '../../hooks/useVisbilityPercent'

function MangaChapter(props: any) {
  const { onChapterFinished = () => {}, onVisiblityChange } = props
  const isActive = useRef(true)
  const isLoading = useRef(false)
  const nextChapterRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const [isVisible, disaleVisbilityDetection] = useOnScreen(
    nextChapterRef,
    window.innerHeight * 4
  )
  const [
    visbilityPercetage,
    disableVisibiltyPercentageTracker
  ] = useVisibilityPercent(outerRef)

  useEffect(() => {
    if (visbilityPercetage > 80) {
      onVisiblityChange(true)
    } else {
      onVisiblityChange(false)
    }
  }, [onVisiblityChange, visbilityPercetage])

  const nextChapterLoadCommand = useCallback(async () => {
    if (!isActive.current) return
    if (isLoading.current) return

    isLoading.current = true
    const isDone = await onChapterFinished()
    if (isDone) {
      isActive.current = false
      disaleVisbilityDetection()
    }
    isLoading.current = false
  }, [onChapterFinished])

  useEffect(() => {
    if (isVisible) {
      nextChapterLoadCommand()
    }
  }, [isVisible, nextChapterLoadCommand])

  const nextChapterButtonClicked = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      nextChapterLoadCommand()
    },
    [nextChapterLoadCommand]
  )

  return (
    <div ref={outerRef}>
      {props.children}
      <div
        className="text-center"
        ref={nextChapterRef}
        style={{
          fontSize: '2rem',
          padding: '1rem'
        }}>
        <button
          onClick={nextChapterButtonClicked}
          className="rounded-full bg-gray-100 px-4 text-blue-600">
          Next Chapter
        </button>
      </div>
    </div>
  )
}

export default MangaChapter
