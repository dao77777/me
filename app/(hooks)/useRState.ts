import { useRef, useState } from "react";

export const useRState = <T extends any>(initialVal: T) => {
  const [state, setState] = useState<T>(initialVal);
  const stateR = useRef<T>(initialVal);
  stateR.current = state;

  return [state, setState, stateR] as const;
};
