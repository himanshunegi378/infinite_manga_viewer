import Axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import config from "../../config";
import MangaChapter from "../mangaChapter/MangaChapter.component";

function MangaViewer(props: any) {
  const { initialLink = "" } = props;
  const [imageLinks, setImageLinks] = useState<string[][]>([]);
  const [nextChapterLink, setNextChapterLink] = useState<string>("");

  useEffect(() => {
    if (!initialLink) return;
    setImageLinks([]);
    fetchChapterData(initialLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLink]);

  const fetchChapterData = useCallback(async (link: string) => {
    try {
      const response = await Axios({
        method: "GET",
        url: config.backendBaseUrl
          .concat("/api/chapterImageList")
          .concat(`/${encodeURIComponent(link)}`),
      });
      const responseData = response.data;
      if (responseData.status === 1) {
        if (responseData.code === "CHAPTER") {
          setImageLinks((data: string[][]): any => {
            const newData = [...data, [...responseData.imageList]];
            return newData;
          });
          setNextChapterLink(responseData.nextChapterLink);
          return "SUCCESS";
        } else if (responseData.code === "COMPLETE") {
          return "SUCCESS";
        }
      }
    } catch (error) {
      console.log("Error while fetching chapter data: " + error);
      return "FAIL";
    }
  }, []);

  const onChapterFinished = useCallback(() => {
    if (!nextChapterLink) return;
    fetchChapterData(nextChapterLink);
  }, [fetchChapterData, nextChapterLink]);

  return (
    <div
      style={{
        backgroundColor: "",
      }}
    >
      <div
        className="shadow-md width-full md:w-1/2 lg:w-5/12"
        style={{
          //   maxWidth: "720px",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid #e5e5e5",
        }}
      >
        {imageLinks.map((link: string[], index: number) => {
          return (
            <MangaChapter
              imageLinks={link}
              onChapterFinished={onChapterFinished}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MangaViewer;
