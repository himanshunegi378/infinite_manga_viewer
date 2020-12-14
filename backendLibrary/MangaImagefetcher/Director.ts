export default class MangaImageFetcherDirector {
  async construct(builder) {
    await builder.fetchPage();
    await builder.extractImageLinks();
    await builder.extractNextChapteLink();
  }
}
