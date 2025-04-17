import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
// import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db";
import Resend from "next-auth/providers/resend";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // debug: true,
    adapter: DrizzleAdapter(db),
    session: {
        strategy: "jwt"
    },
    providers: [
        // Credentials({
        //     credentials: { password: { label: "Password", type: "password" } },
        //     authorize(c) {
        //         if (c?.password !== "password") return null;
        //         return {
        //             id: "test",
        //             name: "Test User",
        //             email: "test@example.com",
        //             image: "https://avatars.githubusercontent.com/u/57589915?v=4"
        //         };
        //     },
        // }),
        Resend({
            from: "verify@dao77777.space",
        }),
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    pages: {
        // signIn: '/auth/signin',
        // signOut: '/auth/signout',
        // error: '/auth/error',
        // verifyRequest: '/auth/verify-request',
        // newUser: undefined
    }
});