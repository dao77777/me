import { useRState } from "./useRState";
import { useTransitionValue } from "./useTransitionValue";

export const useRTState = <T extends any>(initialVal: T) => {
  const [state, setState, stateR] = useRState<T>(initialVal);
  const [stateT, isPending] = useTransitionValue(state);
  return [state, setState, stateR, stateT, isPending] as const;
};
