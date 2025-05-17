import { QueryClient } from "@tanstack/react-query";
import { SuperJSON } from "superjson";

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize
      }
    }
  })
}

let queryClient = undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient();
  queryClient ??= createQueryClient();
  return queryClient;
}