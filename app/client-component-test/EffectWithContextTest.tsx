'use client'

/**
 * useEffectWithContext test
 */

import { useState } from "react";
import { useEffectWithContext } from "../(hooks)";

export const EffectWithContextTest = () => {
  const [text, setText] = useState(1);
  const [counter, setCounter] = useState(0);

  useEffectWithContext((context) => {
    context.intervalId = setInterval(() => {
      setCounter(c => c + 1);
    }
    , text * 1000);
    return () => {
      clearInterval(context.intervalId);
    }
  }, [text]);

  return (
    <div>
      <input
        className="border-[1px]"
        type="number"
        value={text}
        onChange={e => setText(parseInt(e.target.value) || 1)}
      />
      {counter}
    </div>
  )
}