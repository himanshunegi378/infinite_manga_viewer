import React, {
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import useEffectDebugger from '../../hooks/useEffectDebug'
import useOnScreen from '../../hooks/useOnScreen'
import useVisibilityPercent from '../../hooks/useVisbilityPercent'
import MangaImage from '../mangaImage/MangaImage.component'

type Props = {
  onChapterFinished: () => Promise<boolean>
  onVisibilityChange: (arg0: boolean) => void
  chapterUrl: string
  chapterImagesUrl: string[]
}
function MangaChapter(props: Props): ReactElement {
  const { onChapterFinished, onVisibilityChange, chapterImagesUrl = [] } = props
  const isActive = useRef(true)
  const isLoading = useRef(false)
  const nextChapterRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const isAlreadyVisible = useRef(false)
  const [isVisible] = useOnScreen(
    nextChapterRef,
    600,
    100,
    isActive.current ? true : false
  )
  const [
    visbilityPercetage,
    disableVisibiltyPercentageTracker
  ] = useVisibilityPercent(outerRef)

  useEffect(() => {
    if (visbilityPercetage > 80) {
      if (!isAlreadyVisible.current) {
        isAlreadyVisible.current = true
        onVisibilityChange(isAlreadyVisible.current)
      }
    } else {
      if (isAlreadyVisible.current) {
        isAlreadyVisible.current = false
        onVisibilityChange(isAlreadyVisible.current)
      }
    }
  }, [onVisibilityChange, visbilityPercetage])

  const nextChapterLoadCommand = useCallback(async () => {
    if (!isActive.current) return
    if (isLoading.current) return

    isLoading.current = true
    const isDone: boolean = await onChapterFinished()
    if (isDone) {
      isActive.current = false
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
      {chapterImagesUrl.map((url, index) => (
        <MangaImage key={index} imageLink={url} visibilityDetection={true} />
      ))}
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
