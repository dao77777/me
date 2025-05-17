import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";

export const createContext = async ({ info, req, resHeaders }: FetchCreateContextFnOptions) => {
  return {
    info,
    req,
    resHeaders
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext
  });
}

export const handlers = {
  GET: handler,
  POST: handler
}

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON
});

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx, signal }) => {
      return {
        greeting: `Hello ${input.text}`
      }
    })
})

export type AppRouter = typeof appRouter;