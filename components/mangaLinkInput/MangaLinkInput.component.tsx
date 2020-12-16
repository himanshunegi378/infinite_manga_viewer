import React, {
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function MangaLinkInput(props: any) {
  const { onLinkSubmitted = () => {} } = props;
  const [link, setLink] = useState("");
  const previousScrllTopRef = useRef(0);
  const hideableSearchBoxRef = useRef(null);
  const innerHideableSearchBoxRef = useRef(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLinkSubmitted(link);
  };

  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
  }

  const isNegative = (num: number) => {
    if (Math.sign(num) === -1 || Math.sign(num) === -0) {
      return true;
    } else {
      return false;
    }
  };

  const moveSearchBox = useCallback(
    (searchBox: HTMLElement | null, offset: number) => {
      if (!searchBox) {
        return;
      }
      if (!innerHideableSearchBoxRef.current) {
        return;
      }
      //@ts-ignore
      const searchBoxHeight = innerHideableSearchBoxRef.current.getBoundingClientRect()
        .height;
      const newTopValue: number =
        Number(searchBox.style.top.slice(0, -2)) - offset;
      if (isNegative(offset)) {
        searchBox.style.top =
          (newTopValue > searchBoxHeight ? searchBoxHeight : newTopValue) +
          "px";
        //move searchbox down
      } else {
        //move searchbox up
        searchBox.style.top =
          (Math.sign(newTopValue) === -1 ? "0" : newTopValue.toString()) + "px";
      }
    },
    []
  );

  const amountScrolled = useCallback(() => {
    var winheight =
      window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
    var docheight = getDocHeight();
    var scrollTop =
      window.pageYOffset ||
      (
        document.documentElement ||
        (document.body.parentNode as HTMLElement) ||
        document.body
      ).scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100); // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    const diff = scrollTop - previousScrllTopRef.current;
    previousScrllTopRef.current = scrollTop;
    moveSearchBox(hideableSearchBoxRef.current, diff);
  }, [moveSearchBox]);

  useEffect(() => {
    window.addEventListener("scroll", amountScrolled, false);
    return () => {
      window.removeEventListener("scroll", amountScrolled, false);
    };
  }, [amountScrolled]);

  return (
    <>
      <div
        className="relative md:w-1/2 lg:w-5/12 "
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="w-full px-2 py-4 bg-gray-200 rounded-t-md shadow-md">
          <form className="flex" onSubmit={onSubmit}>
            <input
              className="w-full px-2 rounded-l-sm"
              type="text"
              value={link}
              onChange={(e) => setLink(e.currentTarget.value)}
            />
            <button
              className="rounded-r-sm px-4 py-1 font-medium bg-blue-500 text-gray-100"
              type="submit"
            >
              View
            </button>
          </form>
        </div>
      </div>

      <div
        ref={hideableSearchBoxRef}
        className="fixed left-0 right-0 md:w-1/2 lg:w-5/12"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          ref={innerHideableSearchBoxRef}
          className="w-full px-2 py-4 bg-gray-200 rounded-t-md shadow-md absolute bottom-0 transform"
        >
          <form className="flex" onSubmit={onSubmit}>
            <input
              className="w-full px-2 rounded-l-sm"
              autoFocus={true}
              type="text"
              value={link}
              onChange={(e) => setLink(e.currentTarget.value)}
            />
            <button
              className="rounded-r-sm px-4 py-1 font-medium bg-blue-500 text-gray-100"
              type="submit"
            >
              View
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MangaLinkInput;
