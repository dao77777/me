'use client'

import { getQueryClient } from "@/lib/react-query"
import { getTRPCClient, tc } from "@/lib/trpc/client"
import { FC, ReactNode, useState } from "react"

export const TRPCProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => getQueryClient());
  const [trpcClient] = useState(() => getTRPCClient());

  return (
    <tc.Provider queryClient={queryClient} client={trpcClient}>
      {children}
    </tc.Provider>
  )
}