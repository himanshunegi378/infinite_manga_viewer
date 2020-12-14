export default class MangaChapterImageList {
  linkList: string[];
  nextChapterLink: string;
  constructor(linkList: string[]) {
    this.linkList = linkList;
  }
  getImageLinks() {
    return this.linkList;
  }
  setLinks(linkList: string[]) {
    this.linkList = linkList;
  }

  setNextChapterLink(link: string) {
    this.nextChapterLink = link;
  }
}
