import { AppProps } from "next/app";
import React, { useCallback, useEffect, useState } from "react";
import MangaLinkInput from "../components/mangaLinkInput/MangaLinkInput.component";
import MangaViewer from "../components/mangaViewer/MangaViewer.component";

function App(props: any) {
  const { chapterURL = "" } = props;
  const [initialLink, setInitialLink] = useState(chapterURL);

  const onLinkSubmitted = useCallback((link: string) => {
    setInitialLink(link);
  }, []);

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
      chapterURL: context.query.chapterURL,
    }, // will be passed to the page component as props
  };
}

export default App;
