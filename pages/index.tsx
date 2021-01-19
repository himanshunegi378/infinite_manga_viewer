import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import MangaLinkInput from '../components/mangaLinkInput/MangaLinkInput.component'
import MangaViewer from '../components/mangaViewer/MangaViewer.component'

type Props = {
  chapterUrl: string
}

function App(props: Props):ReactElement {
  const { chapterUrl = '' } = props
  const [initialLink, setInitialLink] = useState(chapterUrl)

  useEffect(() => {
    if (!chapterUrl) return
    setInitialLink(chapterUrl)
  }, [chapterUrl])

  const handleLinkSubmit = useCallback((link: string) => {
    if (!link) return
    setInitialLink(link)
  }, [])

  return (
    <div
      className="App"
      style={{
        backgroundColor: ''
      }}>
      <MangaLinkInput onLinkSubmit={handleLinkSubmit} />
      <MangaViewer initialLink={initialLink} />
    </div>
  )
}
export async function getServerSideProps(context) {
  return {
    props: {
      chapterUrl: context.query.chapterURL || null
    } // will be passed to the page component as props
  }
}

export default App
