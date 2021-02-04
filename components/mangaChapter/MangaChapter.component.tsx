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
  // dormant: boolean
}
function MangaChapter(props: Props): ReactElement {
  const { onChapterFinished, onVisibilityChange, chapterImagesUrl = [] } = props
  const [isNextChapterLoadCommandSentSuccessfully, setIsNextChapterLoadCommandSentSuccessfully] = useState(false)
  const isLoading = useRef(false)
  const nextChapterButtonRef = useRef<HTMLDivElement>(null)
  const chpaterContainerElementRef = useRef<HTMLDivElement>(null)
  const isAlreadyVisible = useRef(false)
  const [isVisible] = useOnScreen(
    nextChapterButtonRef,
    window.innerHeight * 4 || 2001,
    100,
    isNextChapterLoadCommandSentSuccessfully ? false : true
  )
  const [
    visbilityPercetage,
    disableVisibiltyPercentageTracker
  ] = useVisibilityPercent(chpaterContainerElementRef)

  /**
   * Emit current visibilty Status
   */
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

  /**
   * Load next chapter and make sure
   * only one request is made at a time
   */
  const nextChapterLoadCommand = useCallback(async () => {
    if (isNextChapterLoadCommandSentSuccessfully) return
    if (isLoading.current) return

    isLoading.current = true
    const isDone: boolean = await onChapterFinished()
    if (isDone) {
      setIsNextChapterLoadCommandSentSuccessfully(true)
    }
    isLoading.current = false
  }, [onChapterFinished, isNextChapterLoadCommandSentSuccessfully])

  /**
   * When chapter Become visible load the next chapter
   */
  useEffect(() => {
    if (isVisible) {
      nextChapterLoadCommand()
    }
  }, [isVisible, nextChapterLoadCommand])

  /**
   * To load next chapter by button click
   */
  const nextChapterButtonClicked = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      nextChapterLoadCommand()
    },
    [nextChapterLoadCommand]
  )

  return (
    <div ref={chpaterContainerElementRef}>
      {chapterImagesUrl.map((url, index) => (
        <MangaImage
          key={index}
          imageLink={url}
          visibilityDetection={visbilityPercetage > 0 ? true : false}
        />
      ))}
      <div
        className="text-center"
        ref={nextChapterButtonRef}
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
