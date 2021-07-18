import Axios, { AxiosResponse } from 'axios'
import MangaChapterInfoBuilder from './MangChapterInfoBuilder'
import cheerio from 'cheerio'

export default class mangakakalotChapterInfoBuilder extends MangaChapterInfoBuilder {
  protected pageData: any
  protected $: cheerio.Root
  constructor(link: string) {
    super(link)
  }

  async fetchPage(): Promise<mangakakalotChapterInfoBuilder> {
    try {
      const response: AxiosResponse<any> = await Axios({
        method: 'GET',
        url: this.link,
        headers: {
            'Access-Control-Allow-Origin': 'https://mangakakalot.com/',
          Referer: 'https://mangakakalot.com/'
        }
      })

      this.pageData = response.data
      this.$ = cheerio.load(this.pageData)
    } catch (error) {
      throw new Error('Error in fetching page')
    }
    return this
  }

  async extractImageLinks(): Promise<mangakakalotChapterInfoBuilder> {
    try {
      const imagesUrl: string[] = this.$('.container-chapter-reader img')
        .toArray()
        .map((x): string => {
          return this.$(x).attr('src').trim()
        })
      this.mangaChapterInfo.chapterImagesURL = imagesUrl
    } catch (error) {
      throw new Error('Errror Extracting Image Links ' + error)
    }
    return this
  }
  async extractNextChapteLink(): Promise<mangakakalotChapterInfoBuilder> {
    try {
      const nextChapterUrl: string = this.$('btn-navigation-chap .back')
        .first()
        .attr('href')
      this.mangaChapterInfo.nextChapterURL = nextChapterUrl
    } catch (error) {
      throw new Error('Error Extracting Next chapter Link ' + error)
    }
    return this
  }

  async extractTitle(): Promise<mangakakalotChapterInfoBuilder> {
    try {
      const chapterTitle: string = this.$('.info-top-chapter h2').first().text()
      this.mangaChapterInfo.chapterTitle = chapterTitle
    } catch (error) {
      throw new Error('Error Extracting chapter Title ' + error)
    }
    return this
  }
  async extractMangaName(): Promise<mangakakalotChapterInfoBuilder> {
    try {
      const mangaTitle: any = this.$('.info-top-chapter h2').first().text()

      this.mangaChapterInfo.mangaTitle = mangaTitle
    } catch (error) {
      throw new Error('Error Extracting Manga Title ' + error)
    }
    return this
  }
}
