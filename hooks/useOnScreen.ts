import { useCallback, useEffect, useState } from "react";

export default function useOnScreen(ref: any, offset: number):[boolean,()=>void] {
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const checkVisbility = useCallback(
    (element: any, offset: number): boolean => {
      const position = element.getBoundingClientRect();
      if (
        //@ts-ignore
        (position.top - offset < window.innerHeight &&
          position.top - offset >= 0) ||
        //@ts-ignore
        (position?.bottom + offset < window.innerHeight &&
          position?.bottom + offset >= 0) ||
        (position.top - offset < window.innerHeight &&
          position.bottom + offset > window.innerHeight)
      ) {
        return true;
      } else {
        return false;
      }
    },
    []
  );

  useEffect(() => {
    if (checkVisbility(ref.current, offset)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [checkVisbility, offset, ref]);

  useEffect(() => {
    if (isDisabled) {
      return;
    }
    const onScroll = () => {
      if (!ref.current) {
        return;
      }
      if (checkVisbility(ref.current, offset)) {
        if (!isVisible) {
          setIsVisible(true);
        }
      } else {
        if (isVisible) {
          setIsVisible(false);
        }
      }
    };
    window.addEventListener("scroll", onScroll, true);
    return () => {
      // window.removeEventListener("scroll", onScroll);
    };
  }, [checkVisbility, isDisabled, isVisible, offset, ref]);

  const disable = useCallback((): void => {
    setIsDisabled(true);
  }, []);

  return [isVisible, disable];
}
