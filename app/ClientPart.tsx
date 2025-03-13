'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ClientPart() {
  const [s1, setS1] = useState(0);
  const [l1, setL1] = useState([1, 2, 3, 4, 5, 6, 7]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Button onClick={() => setS1(c => c + 1)}>Click Me</Button>
      <div>{s1}</div>
      <div className="flex items-center gap-2 selection:bg-sky-300">
        {
          l1.sort((a, b) => b - a).map((v, i) => (
            <div key={i}>{v}</div>
          ))
        }
      </div>
      <details>wow</details>
    </div>
  );
}
