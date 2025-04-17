import { useEffect, useRef } from "react";

export const useTimeout = (cb: Function, ms: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      cb();
    }, ms);
    return () => {
      timer.current && clearTimeout(timer.current!);
    }
  }, [])
}
