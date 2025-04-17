import { useEffect, useState, useTransition } from "react";

export const useTransitionValue = <T extends any>(value: T) => {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    startTransition(() => {
      setState(value);
    });
  }, [value]);
  return [state, isPending] as const;
}
