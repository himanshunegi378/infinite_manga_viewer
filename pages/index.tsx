import { AppProps } from "next/app";
import React, { useCallback, useEffect, useState } from "react";
import MangaLinkInput from "../components/mangaLinkInput/MangaLinkInput.component";
import MangaViewer from "../components/mangaViewer/MangaViewer.component";

function App(props: AppProps) {
  const [initialLink, setInitialLink] = useState("");

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

export default App;
