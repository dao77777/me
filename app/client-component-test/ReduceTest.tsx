'use client'

/**
 * useReduce test
 */

import { useState } from "react";
import { useReduce } from "../(hooks)";

export const ReduceTest = () => {
  const [text, setText] = useState("");
  const [text1, setText1] = useState("");
  const [count, setCount] = useState(0);
  const [textArr, setTextArr] = useState<string[]>([]);

  useReduce(() => {
    setCount(c => c + 1);
    setTextArr(arr => [...arr, text]);
  }, [text]);

  return (
    <div>
      <input
        className="border-[1px]"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <input
        className="border-[1px]"
        type="text"
        value={text1}
        onChange={e => setText1(e.target.value)}
      />
      <div>{count}</div>
      <ul>
        {textArr.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}