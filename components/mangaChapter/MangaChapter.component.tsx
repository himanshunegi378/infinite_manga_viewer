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
  const [isActive, setIsActive] = useState(true);
  const nextChapterRef = useRef<HTMLDivElement>(null);
  const [isVisible, disable] = useOnScreen(
    nextChapterRef,
    window.innerHeight * 4
  );

  useEffect(() => {
    if (isVisible && isActive) {
      onChapterFinished();
      setIsActive(false);
    }
  }, [isVisible, onChapterFinished, isActive]);

  const nextChapterButtonClicked = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isActive) {
        onChapterFinished();
        setIsActive(false);
      }
    },
    [isActive]
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
