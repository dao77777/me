import { useEffect, useRef } from "react";

export const useInterval = (cb: Function, ms: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timer.current = setInterval(() => {
      cb();
    }, ms);
    return () => {
      timer.current && clearInterval(timer.current!);
    }
  }, [])
}
