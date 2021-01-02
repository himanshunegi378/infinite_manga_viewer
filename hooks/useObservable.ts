import { useEffect, useRef, useCallback } from "react";
import { Observable, Subscription } from "rxjs";

export default function useObservable<T>(
  observable: Observable<T>,
  observer: () => void
):[()=>void,()=>void] {
  const subscriptionRef = useRef<Subscription>();
  const isSubscribedRef = useRef<boolean>(false);

  const subscribe = useCallback(
    function () {
      if (isSubscribedRef.current) return;
      const _ = observable.subscribe(observer);
      subscriptionRef.current = _;
      isSubscribedRef.current = true;
    },
    [observable, observer]
  );

  const unsubscribe = useCallback(function () {
    if (!subscriptionRef.current || !isSubscribedRef.current) return;
    subscriptionRef.current.unsubscribe();
    subscriptionRef.current = undefined;
    isSubscribedRef.current = false;
  }, []);

  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  return [subscribe, unsubscribe];
}
