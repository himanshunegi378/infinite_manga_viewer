import Axios from "axios";
import MangaImageLinkBuilder from "./MangaImageLinkBuilder";
const cheerio = require("cheerio");

export default class MangaTxImageLinkBuilder extends MangaImageLinkBuilder {
  pageData: any;
  $: any;
  async fetchPage() {
    const pageData = await Axios({
      method: "GET",
      url: this.link,
      headers: {
        "Access-Control-Allow-Origin": "https://mangatx.com/",
        Referer: "https://mangatx.com/",
      },
    }).then((response) => {
      this.pageData = response.data;
      return response.data;
    }).catch(err=>console.log(err));
  }
  async extractImageLinks() {
    this.$ = cheerio.load(this.pageData);

    const imageLinks = this.$(".reading-content img")
      .map((i, x) => {
        return this.$(x).attr("data-src").trim();
      })
      .toArray();
    this.mangaImageLink.setLinks(imageLinks);
    // throw new Error("Method not implemented.");
  }
  async extractNextChapteLink() {
    const nextPageLink = this.$(".nav-next > a")[0].attribs.href;
    this.mangaImageLink.setNextChapterLink(nextPageLink)
  }
}

