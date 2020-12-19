import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useOnScreen from "../../hooks/useOnScreen";
import MangaImage from "../mangaImage/MangaImage.component";

function MangaChapter(props: any) {
  const { imageLinks, onChapterFinished = () => {} } = props;
  const isActive = useRef(true);
  const nextChapterRef = useRef<HTMLDivElement>(null);
  const [isVisible, disable] = useOnScreen(
    nextChapterRef,
    window.innerHeight * 4
  );
  const nextChapterLoadCommand = useCallback(async () => {
    if (!isActive.current) return;

    const status = await onChapterFinished();
    console.log(status);
    if (status === "SUCCESS") {
      isActive.current = false;
      disable();
    }
  }, [onChapterFinished]);

  useEffect(() => {
    if (isVisible) {
      nextChapterLoadCommand();
    }
  }, [isVisible, nextChapterLoadCommand]);

  const nextChapterButtonClicked = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
     // nextChapterLoadCommand();
    },
    [nextChapterLoadCommand]
  );

  return (
    <>
      {imageLinks.map((link: string, index: number) => {
        return <MangaImage key={index} imageLink={link} />;
      })}
      <div
        className="text-center"
        ref={nextChapterRef}
        style={{
          fontSize: "2rem",
          padding: "1rem",
        }}
      >
        <button
          onClick={nextChapterButtonClicked}
          className="rounded-full bg-gray-100 px-4 text-blue-600"
        >
          Next Chapter
        </button>
      </div>
    </>
  );
}

export default MangaChapter;
