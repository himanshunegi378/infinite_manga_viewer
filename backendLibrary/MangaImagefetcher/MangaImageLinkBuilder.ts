import MangaChapterImageList from "./MangaChapterImageList";

export default class MangaImageLinkBuilder {
  link: string;
  mangaImageLink: MangaChapterImageList;
  constructor(link: string) {
    this.link = link;
    this.mangaImageLink = new MangaChapterImageList([]);
  }

  fetchPage() {}
  extractImageLinks() {}
  extractNextChapteLink() {}
  show() {
    return this.mangaImageLink;
  }
}
