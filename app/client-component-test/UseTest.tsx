'use client'

import { FC, memo, ReactNode, Suspense, use, useEffect, useState, useTransition } from "react";

/**
 * use Test
 */

export const UseTest: FC<{ promise: Promise<string>, children: ReactNode }> = ({ promise, children }) => {
  const [input, setInput] = useState("");
  const [inputTransition, setInputTransition] = useState(input);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => {
      setInputTransition(input);
    })
  }, [input]);


  const val = use(promise);

  return (
    <div className="w-full h-full">
      UseTest
      <div>{val}</div>
      <input className="border-[1px]" type="text" value={input} onChange={e => setInput(e.target.value)} />
      {children}
      {isPending && <div className="text-red-500">Pending...</div>}
      <div className="h-10 overflow-auto">
        <Suspense fallback={<div className="text-red-500">Loading...</div>}>
          <TransitionComponents text={inputTransition} />
        </Suspense>
      </div>
      {/* <Suspense fallback={<div className="text-red-500">Loading...</div>}> */}
        <Test />
      {/* </Suspense> */}
    </div>
  )
}

const Test = () => {
  const s1 = use(new Promise<string>((resolve) => {
    setTimeout(() => {
      console.log(__dirname);
      resolve("wow");
    }, 3000)
  }))

  return (
    <div>Test {s1}</div>
  )
}

const TransitionComponents = memo(({ text }: { text: string }) => {
  return (
    <>
      haha
      {new Array(500).fill(0).map((_, i) => (
        <TransitionComponent key={i} text={text} />
      ))}
    </>

  )
})

const TransitionComponent: FC<{ text: string }> = ({ text }) => {
  if (text !== "") {
    // const anchor = performance.now();
    // while (performance.now() - anchor < 3) { }
  }

  return (
    <div>{text}</div>
  )
}