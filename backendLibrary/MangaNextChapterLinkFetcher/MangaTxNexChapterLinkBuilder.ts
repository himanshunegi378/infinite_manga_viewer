import Axios from "axios";
import NextChapterLinkBuilder from "./NextChapterLinkBuilder";

const cheerio = require("cheerio");

class MangaTxNextChapterLinkBuilder extends NextChapterLinkBuilder {
  pageData: any;
  async fetchCurrentChapter() {
    await Axios({
      method: "GET",
      url: this.currentChapterLink,
      headers: {
        "Access-Control-Allow-Origin": "https://mangatx.com/",
        Referer: "https://mangatx.com/",
      },
    }).then(res=>{
        this.pageData = res.data
        return this.pageData
    }).catch(err=>console.log(err));
  }
  extractNextPageLink() {
      const $ = cheerio.load(this.pageData)
      const nextPageLink = $('.nav-next > a')[0].attribs.href
      this.nextChapterLink.link = nextPageLink
  }
}

module.exports = { MangaTxNextChapterLinkBuilder };
