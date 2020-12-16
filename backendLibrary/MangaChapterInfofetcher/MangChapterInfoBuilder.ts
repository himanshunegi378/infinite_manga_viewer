import MangaChapterInfo from "./MangaChapterInfo";

export default abstract class MangaChapterInfoBuilder {
  protected link: string;
  protected mangaChapterInfo: MangaChapterInfo;
  

  constructor(link: string) {
    this.link = link;
    this.mangaChapterInfo = new MangaChapterInfo([]);
  }

  abstract fetchPage(): Promise<any>;
  abstract extractImageLinks(): Promise<any>;
  abstract extractTitle(): Promise<any>;
  abstract extractNextChapteLink(): Promise<any>;

  show(): MangaChapterInfo {
    return this.mangaChapterInfo;
  }
}
