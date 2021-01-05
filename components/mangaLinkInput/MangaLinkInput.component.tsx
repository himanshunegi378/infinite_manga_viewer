import React, {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { fromEvent, Observable } from 'rxjs'

type Props = {
  onLinkSubmit: (arg0: string) => void
}

function MangaLinkInput(props: Props): ReactElement {
  const { onLinkSubmit = () => {} } = props
  const [link, setLink] = useState('')
  const previousScrllTopRef = useRef(0)
  const hideableSearchBoxRef = useRef(null)
  const yValue = useRef(0)
  const innerHideableSearchBoxRef = useRef(null)
  const [scrollObservalble, setScrollObservalble] = useState<Observable<Event>>(
    null
  )

  useEffect(() => {
    setScrollObservalble(fromEvent(window, 'scroll'))
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLinkSubmit(link)
  }

  const isNegative = (num: number) => {
    if (Math.sign(num) === -1 || Math.sign(num) === 0) {
      return true
    } else {
      return false
    }
  }

  const moveSearchBox = useCallback(
    (searchBox: HTMLElement | null, offset: number) => {
      if (!searchBox) {
        return
      }
      if (!innerHideableSearchBoxRef.current) {
        return
      }
      const searchBoxHeight = innerHideableSearchBoxRef.current.getBoundingClientRect()
        .height
      if (isNegative(offset)) {
        //move searchbox down
        searchBox.style.transform = `translatey(${
          yValue.current - offset > 0
            ? (yValue.current = 0)
            : (yValue.current -= offset)
        }px)`
      } else {
        //move searchbox up
        searchBox.style.transform = `translatey(${
          yValue.current - offset < searchBoxHeight * -1
            ? (yValue.current = searchBoxHeight * -1)
            : (yValue.current -= offset)
        }px)`
      }
    },
    []
  )

  const amountScrolled = useCallback(() => {
    const scrollTop =
      window.pageYOffset ||
      (
        document.documentElement ||
        (document.body.parentNode as HTMLElement) ||
        document.body
      ).scrollTop
    const diff = scrollTop - previousScrllTopRef.current
    previousScrllTopRef.current = scrollTop
    moveSearchBox(hideableSearchBoxRef.current, diff)
  }, [moveSearchBox])

  useEffect(() => {
    if (!scrollObservalble) return
    const scrollObserver = scrollObservalble.subscribe(() => {
      amountScrolled()
    })

    return () => {
      scrollObserver.unsubscribe()
    }
  }, [amountScrolled, scrollObservalble])

  return (
    <>
      <div
        className="relative md:w-1/2 lg:w-5/12 "
        style={{
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <div className="w-full px-2 py-4 bg-gray-200 rounded-t-md shadow-md">
          <form className="flex" onSubmit={onSubmit}>
            <input
              className="w-full px-2 rounded-l-sm"
              type="text"
              value={link}
              onChange={e => setLink(e.currentTarget.value)}
            />
            <button
              className="rounded-r-sm px-4 py-1 font-medium bg-blue-500 text-gray-100"
              type="submit">
              View
            </button>
          </form>
        </div>
      </div>

      <div
        ref={hideableSearchBoxRef}
        className="fixed left-0 right-0 md:w-1/2 lg:w-5/12"
        style={{
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
        <div
          ref={innerHideableSearchBoxRef}
          className="w-full px-2 py-4 bg-gray-200 rounded-t-md shadow-md absolute bottom-0 transform">
          <form className="flex" onSubmit={onSubmit}>
            <input
              className="w-full px-2 rounded-l-sm"
              autoFocus={true}
              type="text"
              value={link}
              onChange={e => setLink(e.currentTarget.value)}
            />
            <button
              className="rounded-r-sm px-4 py-1 font-medium bg-blue-500 text-gray-100"
              type="submit">
              View
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default MangaLinkInput
