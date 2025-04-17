'use client'

/**
 * useRState test
 */

import { useEffect, useRef } from "react";
import { useRState } from "../(hooks)";

export const RStateTest = () => {
  const [text, setText, textRef] = useRState("");
  const timer = useRef<NodeJS.Timeout | null>(null);

  const logText = () => {
    timer.current = setInterval(() => {
      console.log(textRef.current);
    }, 1000);
  };

  const syncTimer = () => {
    logText();
    return () => {
      timer.current && clearInterval(timer.current!);
    }
  }

  useEffect(syncTimer, []);

  return (
    <div className="w-full h-full">
      <input
        className="border-[1px]"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}