import { NextApiRequest, NextApiResponse } from 'next'
import MangaImageFetcherDirector from '../../../backendLibrary/MangaChapterInfofetcher/Director'
import MangaTxChapterInfoBuilder from '../../../backendLibrary/MangaChapterInfofetcher/MangaTxChapterInfoBuilder'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { chapterLink }
  } = req
  try {
    console.log('Current chapter: ' + chapterLink)
    const mangaImageFetchingDirector = new MangaImageFetcherDirector()
    const mangatxImageLinksBuilder = new MangaTxChapterInfoBuilder(
      chapterLink as string
    )
    await mangaImageFetchingDirector.construct(mangatxImageLinksBuilder)
    const mangaChapterInfo = mangatxImageLinksBuilder.show()
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
