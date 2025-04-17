'use client'

import { QueryClient, QueryClientProvider as Provider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const queryClient = new QueryClient()

export const QueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Provider client={queryClient}>
      {children}
    </Provider>
  )
}