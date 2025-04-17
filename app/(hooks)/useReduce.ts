import { useState } from 'react';

export const useReduce = (cb: () => void, dependencies: any[]) => {
  const [prevItems, setPrevItems] = useState(dependencies);
  const diff = prevItems.some((val, i) => val !== dependencies[i]);
  if (diff) {
    cb();
    setPrevItems(dependencies);
  }
}