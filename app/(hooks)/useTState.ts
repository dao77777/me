import { useState } from "react";
import { useTransitionValue } from "./useTransitionValue";

export const useTState = <T extends any>(initialVal: T) => {
  const [state, setState] = useState<T>(initialVal);
  const [stateT, isPending] = useTransitionValue(state);
  return [state, setState, stateT, isPending] as const;
}
