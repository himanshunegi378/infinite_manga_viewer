import Axios from "axios";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import useOnScreen from "../../hooks/useOnScreen";

function MangaImage(props: any) {
  const { imageLink } = props;
  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isVisible, disable] = useOnScreen(ref, window.innerHeight);

  useEffect(() => {
    let id: number | undefined = undefined;
    if (isVisible) {
      id = window.setTimeout(() => {
        setIsActive(true);
        disable();
      }, 500);
    }
    return () => {
      window.clearTimeout(id);
    };
  }, [isVisible, disable]);

  const onImageLoaded = () => {
    //@ts-ignore
    ref.current.style.height = "auto";
  };

  const onError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setErr(true);
  };

  const retry = () => {
    setErr(false);
    if (!imageRef.current) return;
    imageRef.current.src = "sfsf";
    imageRef.current.src = imageLink;
  };

  return (
    <div
      ref={ref}
      style={{
        height: "500px",
      }}
    >
      {err ? (
        <div className=' flex flex-wrap justify-center content-center h-full'>
          <button className="bg-blue-500 px-4 py-2 rounded-md font-semibold text-lg text-white" onClick={retry}>
            Retry
          </button>
        </div>
      ) : null}
      {isActive ? (
        <img
          ref={imageRef}
          style={{
            verticalAlign: "bottom",
            width: "100%",
            height: "auto",
          }}
          src={imageLink}
          onLoad={onImageLoaded}
          onError={onError}
          referrerPolicy="no-referrer"
          alt="l"
        />
      ) : null}
    </div>
  );
}

export default MangaImage;
