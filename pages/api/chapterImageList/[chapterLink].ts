import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'psl'
import MangaImageFetcherDirector from '../../../backendLibrary/MangaChapterInfofetcher/Director'
import MangaTxChapterInfoBuilder from '../../../backendLibrary/MangaChapterInfofetcher/MangaTxChapterInfoBuilder'
import MangaKakalotChapterInfoBuilder from '../../../backendLibrary/MangaChapterInfofetcher/MangaKakalotChapterInfoBuilder'
import MangaChapterInfoBuilder from '../../../backendLibrary/MangaChapterInfofetcher/MangChapterInfoBuilder'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { chapterLink }
  } = req
  try {
    console.log('Current chapter: ' + chapterLink)
    const mangaImageFetchingDirector = new MangaImageFetcherDirector()
    let mangaImageLinkBuilder: MangaChapterInfoBuilder = null
    const parsed = parse(new URL(chapterLink as string).host)
    console.log(parsed)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    switch (parsed.sld) {
      case 'mangatx':
        mangaImageLinkBuilder = new MangaTxChapterInfoBuilder(
          chapterLink as string
        )
        break
      case 'mangakakalot':
        mangaImageLinkBuilder = new MangaKakalotChapterInfoBuilder(
          chapterLink as string
        )
        break
      default:
        break
    }

    await mangaImageFetchingDirector.construct(mangaImageLinkBuilder)
    const mangaChapterInfo = mangaImageLinkBuilder.show()
    if (mangaChapterInfo.chapterImagesURL.length <= 0) {
      return res.json({
        status: 1,
        code: 'COMPLETE'
      })
    }
    return res.json({
      status: 1,
      code: 'CHAPTER',
      payload: {
        imageList: mangaChapterInfo.chapterImagesURL,
        nextChapterLink: mangaChapterInfo.nextChapterURL,
        chapterTitle: mangaChapterInfo.chapterTitle,
        mangaTitle: mangaChapterInfo.mangaTitle
      }
    })
  } catch (error) {
    console.log('Error get chapter info ' + error)
    return res.json({
      status: 0,
      code: 'ERROR',
      payload: { imageList: [], nextChapterLink: undefined }
    })
  }
}
