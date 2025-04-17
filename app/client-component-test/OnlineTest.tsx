'use client'

/**
 * useOnline test
 */

import { useState } from "react";
import { useOnlineStatus } from "../(hooks)";

export const OnlineTest = () => {
  const isOnline = useOnlineStatus();
  const [text, setText] = useState("");
  console.log(navigator.onLine);

  return (
    <div>
      <div>{isOnline ? "Online" : "Offline"}</div>
      <input
        className="border-[1px]"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  )
}