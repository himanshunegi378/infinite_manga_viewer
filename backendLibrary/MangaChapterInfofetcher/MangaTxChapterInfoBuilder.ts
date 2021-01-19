import Axios, { AxiosResponse } from 'axios'
import MangaChapterInfoBuilder from './MangChapterInfoBuilder'
import cheerio from 'cheerio'

export default class MangaTxChapterInfoBuilder extends MangaChapterInfoBuilder {
  protected pageData: any
  protected $: cheerio.Root
  constructor(link: string) {
    super(link)
  }

  async fetchPage(): Promise<MangaTxChapterInfoBuilder> {
    try {
      const response: AxiosResponse<any> = await Axios({
        method: 'GET',
        url: this.link,
        headers: {
          'Access-Control-Allow-Origin': 'https://mangatx.com/',
          Referer: 'https://mangatx.com/'
        }
      })

      this.pageData = response.data
      this.$ = cheerio.load(this.pageData)
    } catch (error) {
      throw new Error('Error in fetching page')
    }
    return this
  }

  async extractImageLinks(): Promise<MangaTxChapterInfoBuilder> {
    try {
      const imagesUrl: string[] = this.$('.reading-content img')
        .toArray()
        .map((x): string => {
          return this.$(x).attr('data-src').trim()
        })
      this.mangaChapterInfo.chapterImagesURL = imagesUrl
    } catch (error) {
      throw new Error('Errror Extracting Image Links ' + error)
    }
    return this
  }
  async extractNextChapteLink(): Promise<MangaTxChapterInfoBuilder> {
    try {
      const nextChapterUrl: string = this.$('.nav-next > a')
        .first()
        .attr('href')
      this.mangaChapterInfo.nextChapterURL = nextChapterUrl
    } catch (error) {
      throw new Error('Error Extracting Next chapter Link ' + error)
    }
    return this
  }

  async extractTitle(): Promise<MangaTxChapterInfoBuilder> {
    try {
      const chapterTitle: string = this.$('#chapter-heading').first().text()
      this.mangaChapterInfo.chapterTitle = chapterTitle
    } catch (error) {
      throw new Error('Error Extracting chapter Title ' + error)
    }
    return this
  }
  async extractMangaName(): Promise<MangaTxChapterInfoBuilder> {
    try {
      const mangaTitle: any = this.$('.breadcrumb a')
        .get(1)
        .children[0].data.trim()

      this.mangaChapterInfo.mangaTitle = mangaTitle
    } catch (error) {
      throw new Error('Error Extracting Manga Title ' + error)
    }
    return this
  }
}
