import MangaChapterInfoBuilder from './MangChapterInfoBuilder'

export default class MangaImageFetcherDirector {
  async construct(builder: MangaChapterInfoBuilder) {
    await builder.fetchPage()
    await builder.extractImageLinks()
    await builder.extractTitle()
    await builder.extractNextChapteLink()
    return builder
  }
}
