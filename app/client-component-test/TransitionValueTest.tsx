'use client'

/**
 * useTransitionValue test
 */

import { FC, memo } from "react";
import { useInterval, useRTState } from "../(hooks)";

export const TransitionValueTest = () => {
  const [text, setText, textR, textT, isPending] = useRTState("");
  useInterval(() => {
    console.log(textR.current);
  }, 1000)

  return (
    <div className="w-full h-full">
      <input
        className="border-[1px]"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      {/* {isPending 
        ? <div className="text-red-500">Loading...</div>
        : <ComplexComponents text={textTransition} />
      } */}
      {
        isPending && <div className="text-red-500">Loading...</div>
      }
      <ComplexComponents text={textT} />
    </div>
  )
}


const ComplexComponents: FC<{ text: string }> = memo(({ text }) => {
  return (
    <div>
      {new Array(500).fill(0).map((_, i) => (
        <ComplexComponent key={i} text={text} />
      ))}
    </div>
  )
})

const ComplexComponent: FC<{ text: string }> = ({ text }) => {
  const anchor = performance.now();
  while (performance.now() - anchor < 1) { }

  return (
    <div>{text}</div>
  )
}