export default class NextChapterLinkDirector{
    async construct(builder){
        await builder.fetchCurrentChapter()
        await builder.extractNextPageLink()
    }
}
