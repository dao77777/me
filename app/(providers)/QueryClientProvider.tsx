'use client'

import { getQueryClient } from "@/lib/react-query";
import { QueryClientProvider as Provider } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";

export const QueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <Provider client={queryClient}>
      {children}
    </Provider>
  )
}
