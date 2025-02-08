import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn(user) {
          const checkuser = prisma.user.findUnique({
            where: {
              email: user.email
            },
          })
            if (checkuser) {
                 redirect("/upload");
            } else {
                 redirect("/create");
            }
        }
    }
})