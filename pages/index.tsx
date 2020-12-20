import { AppProps } from "next/app";
import React, { useCallback, useEffect, useState } from "react";
import MangaLinkInput from "../components/mangaLinkInput/MangaLinkInput.component";
import MangaViewer from "../components/mangaViewer/MangaViewer.component";
import useEffectDebugger from "../hooks/useEffectDebug";

function App(props: any) {
  const { chapterURL = "" } = props;
  const [initialLink, setInitialLink] = useState(chapterURL);

  useEffect(() => {
    if (!chapterURL) return;
    setInitialLink(chapterURL);
  }, [chapterURL]);

  const onLinkSubmitted = useCallback((link: string) => {
    setInitialLink(link);
  }, []);

  // useEffectDebugger(() => {
  //   const onError = (event) => {
  //     console.log(event.type);
  //     console.log(event);
  //   };
  //   window.addEventListener("error", onError);
  //   return () => {
  //     // window.removeEventListener("error", onError);
  //   };
  // }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: "",
      }}
    >
      <MangaLinkInput onLinkSubmitted={onLinkSubmitted} />
      <MangaViewer initialLink={initialLink} />
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      chapterURL: context.query.chapterURL || null,
    }, // will be passed to the page component as props
  };
}

export default App;
