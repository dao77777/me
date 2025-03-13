import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // debug: true,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        Credentials({
            credentials: { password: { label: "Password", type: "password" } },
            authorize(c) {
                if (c?.password !== "password") return null;
                return {
                    id: "test",
                    name: "Test User",
                    email: "test@example.com",
                    image: "https://avatars.githubusercontent.com/u/57589915?v=4"
                };
            },
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