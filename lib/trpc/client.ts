import { createTRPCReact, httpBatchStreamLink, httpLink, isNonJsonSerializable, loggerLink, splitLink } from '@trpc/react-query'
import { getBaseUrl } from './utils';
import SuperJSON from 'superjson';
import { AppRouter } from './server';

export const tc = createTRPCReact<AppRouter>()

let trpcClient = undefined;

export const getTRPCClient = () => {
  const url = `${getBaseUrl()}/api/trpc`;
  trpcClient ??= tc.createClient({
    links: [
      loggerLink({
        enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === 'down' && op.result instanceof Error)
      }),
      splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          transformer: SuperJSON,
          url,
        }),
        false: httpBatchStreamLink({
          transformer: SuperJSON,
          url,
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          }
        })
      }),
      
    ]
  })

  return trpcClient;
}
