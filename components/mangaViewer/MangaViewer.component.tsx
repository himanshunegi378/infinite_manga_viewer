import Axios from "axios";
import { toUnicode } from "punycode";
import React, { useCallback, useEffect, useState } from "react";
import config from "../../config";
import MangaChapter from "../mangaChapter/MangaChapter.component";
import { useRouter } from "next/router";

const fetchChapterInfo = async (link: string): Promise<any> => {
  try {
    const response = await Axios({
      method: "GET",
      url: process.env.NEXT_PUBLIC_BACKEND_URL.concat(
        "/api/chapterImageList"
      ).concat(`/${encodeURIComponent(link)}`),
    });
    const responseData = response.data;
    if (responseData.status === 1) {
      if (responseData.code === "CHAPTER") {
        return { code: "CHAPTER", data: responseData.payload };
      } else if (responseData.code === "COMPLETE") {
        return { code: "COMPLETE" };
      }
    } else if (responseData.code === "ERROR") {
      return { code: "ERROR" };
    }
  } catch (error) {
    console.log("Error while fetching chapter data: " + error);
    return { code: "ERROR" };
  }
};

function MangaViewer(props: any) {
  const router = useRouter();

  const { initialLink = "" } = props;
  const [imageLinks, setImageLinks] = useState<string[][]>([]);
  const [nextChapterLink, setNextChapterLink] = useState<string>("");

  useEffect(() => {
    if (!initialLink) return;
    setNextChapterLink("")
    fetchChapterInfo(initialLink).then((info) => {
      const { code, data } = info;
      if (code === "CHAPTER") {
        setImageLinks((prevState) => [ [...data.imageList]]);
        setNextChapterLink(data.nextChapterLink);
        router.push(
          `/?chapterURL=${encodeURIComponent(initialLink)}`,
          undefined,
          { shallow: true }
        );
        console.log('initial link ',initialLink);
      }
    });
  }, [initialLink]);

  const onChapterFinished = useCallback(async () => {
    if (!nextChapterLink) return true;

    const { code, data } = await fetchChapterInfo(nextChapterLink);
    if (code === "CHAPTER") {
      router.push(
        `/?chapterURL=${encodeURIComponent(nextChapterLink)}`,
        undefined,
        { shallow: true }
      );
      console.log('next chapter link ',nextChapterLink);

      setImageLinks((prevState) => [...prevState, [...data.imageList]]);
      setNextChapterLink(data.nextChapterLink);

      return true;
    }
    if (code === "COMPLETE") return true;

    return false;
  }, [nextChapterLink]);

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
