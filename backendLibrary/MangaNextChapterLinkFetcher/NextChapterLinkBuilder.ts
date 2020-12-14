import NextChapterLink from "./NextChapterLink"

export default class NextChapterLinkBuilder{
    currentChapterLink: string
    nextChapterLink: NextChapterLink
    constructor(currentChapterLink:string){
        this.currentChapterLink = currentChapterLink
        this.nextChapterLink = new NextChapterLink()
    }
    fetchCurrentChapter(){}
    extractNextPageLink(){}
    show(){
        return this.nextChapterLink
    }
}
