import { useEffect, useRef } from "react";

export const useEffectWithContext = (cb: (context?: any) => any, dependencies?: any[]) => {
  const contextRef = useRef<any>({});
  useEffect(() => {
    return cb(contextRef.current); 
  }, dependencies)
}