import Axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MangaChapter from '../mangaChapter/MangaChapter.component'
import { useRouter } from 'next/router'
import MangaImage from '../mangaImage/MangaImage.component'

const fetchChapterInfo = async (link: string): Promise<any> => {
  try {
    const response = await Axios({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_BACKEND_URL.concat(
        '/api/chapterImageList'
      ).concat(`/${encodeURIComponent(link)}`)
    })
    const responseData = response.data
    if (responseData.status === 1) {
      if (responseData.code === 'CHAPTER') {
        return { code: 'CHAPTER', data: responseData.payload }
      } else if (responseData.code === 'COMPLETE') {
        return { code: 'COMPLETE' }
      }
    } else if (responseData.code === 'ERROR') {
      return { code: 'ERROR' }
    }
  } catch (error) {
    console.log('Error while fetching chapter data: ' + error)
    return { code: 'ERROR' }
  }
}

function MangaViewer(props: any) {
  const router = useRouter()

  const { initialLink = '' } = props
  const [chapterInfoList, setChapterInfoList] = useState<
    { chapterUrl: string; imagesUrl: string[] }[]
  >([])
  const [nextChapterLink, setNextChapterLink] = useState<string>('')
  const currentChapterLink = useRef<string>('')

  const changeCurentChapterUrlInRoute = useRef(null)

  useEffect(() => {
    changeCurentChapterUrlInRoute.current = (chapterUrl: string) => {
      if (chapterUrl === currentChapterLink.current) return
      currentChapterLink.current = chapterUrl
      router.push(`/?chapterURL=${encodeURIComponent(chapterUrl)}`, undefined, {
        shallow: true
      })
    }
  }, [router])

  useEffect(() => {
    if (!initialLink) return
    setNextChapterLink('')
    fetchChapterInfo(initialLink).then(info => {
      const { code, data } = info
      if (code === 'CHAPTER') {
        setChapterInfoList([
          { chapterUrl: initialLink, imagesUrl: data.imageList }
        ])
        setNextChapterLink(data.nextChapterLink)
        changeCurentChapterUrlInRoute.current(initialLink)
      }
    })
  }, [initialLink])

  const onChapterFinished = useCallback(async () => {
    if (!nextChapterLink) return true

    const { code, data } = await fetchChapterInfo(nextChapterLink)
    if (code === 'CHAPTER') {
      setChapterInfoList(prevState => [
        ...prevState,
        { chapterUrl: nextChapterLink, imagesUrl: data.imageList }
      ])
      setNextChapterLink(data.nextChapterLink)

      return true
    }
    if (code === 'COMPLETE') return true

    return false
  }, [nextChapterLink])

  const visibilityHandle = (isVisible: boolean,chapterUrl: string) => {
    if(isVisible){
      changeCurentChapterUrlInRoute.current(chapterUrl)
    }
  }
  

  return (
    <div
      style={{
        backgroundColor: ''
      }}>
      <div
        className="shadow-md width-full max-w-xl"
        style={{
          //   maxWidth: "720px",
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '1px solid #e5e5e5'
        }}>
        {chapterInfoList.map(({ chapterUrl, imagesUrl }, index: number) => {
          return (
            <MangaChapter
              onChapterFinished={onChapterFinished}
              chapterUrl={chapterUrl}
              onVisiblityChange={(visibilitySatus: boolean) => visibilityHandle(visibilitySatus,chapterUrl)}
              key={index}>
              {imagesUrl.map((url, index) => (
                <MangaImage key={index} imageLink={url} />
              ))}
            </MangaChapter>
          )
        })}
      </div>
    </div>
  )
}

export default MangaViewer
