import { NextApiRequest, NextApiResponse } from "next";
import MangaImageFetcherDirector from "../../../backendLibrary/MangaImagefetcher/Director";
import MangaTxImageLinkBuilder from "../../../backendLibrary/MangaImagefetcher/MangaTxImageLinkBuilder";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { chapterLink },
  } = req;
  console.log("Current chapter: " + chapterLink);
  const mangaImageFetchingDirector = new MangaImageFetcherDirector();
  //@ts-ignore
  const mangatxImageLinksBuilder = new MangaTxImageLinkBuilder(chapterLink);
  await mangaImageFetchingDirector.construct(mangatxImageLinksBuilder);
  const mangaImageLinkList = mangatxImageLinksBuilder.show().getImageLinks();
  res.json({
    imageList: mangaImageLinkList,
    nextChapterLink: mangatxImageLinksBuilder.show().nextChapterLink,
  });
};
