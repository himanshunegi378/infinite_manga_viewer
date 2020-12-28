export default class MangaChapterInfo {
  private _chapterImagesURL: string[]
  private _nextChapterURL: string
  private _chapterTitle: string

  public get chapterImagesURL(): string[] {
    return this._chapterImagesURL
  }

  public set chapterImagesURL(value: string[]) {
    this._chapterImagesURL = value
  }

  public get nextChapterURL(): string {
    return this._nextChapterURL
  }

  public set nextChapterURL(value: string) {
    this._nextChapterURL = value
  }

  public get chapterTitle(): string {
    return this._chapterTitle
  }

  public set chapterTitle(value: string) {
    this._chapterTitle = value
  }
  constructor(linkList: string[]) {
    this.chapterImagesURL = linkList
  }
}
