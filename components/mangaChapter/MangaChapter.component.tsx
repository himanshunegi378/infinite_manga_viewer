import React, { useEffect, useRef, useState } from "react";
import useOnScreen from "../../hooks/useOnScreen";
import MangaImage from "../mangaImage/MangaImage.component";

function MangaChapter(props: any) {
  const { imageLinks, onChapterFinished = () => {} } = props;
  const [isActive, setIsActive] = useState(true);
  const nextChapterRef = useRef<HTMLDivElement>(null);
  const [isVisible,disable] = useOnScreen(nextChapterRef, window.innerHeight*4);

  useEffect(() => {
    if (isVisible && isActive) {
      onChapterFinished();
      setIsActive(false);
    }
  }, [isVisible, onChapterFinished,isActive]);

  return (
    <>
      {imageLinks.map((link: string, index: number) => {
        return <MangaImage key={index} imageLink={link} />;
      })}
      <div
      className='text-center'
        ref={nextChapterRef}
        style={{
          fontSize: "2rem",
          padding: "1rem",
        }}
      >
        Next Chapter
      </div>
    </>
  );
}

export default MangaChapter;
