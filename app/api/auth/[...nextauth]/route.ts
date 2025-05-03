import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // For testing purposes, allow hardcoded credentials
          if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
            console.log("Using hardcoded admin credentials")
            return {
              id: "admin-id",
              name: "Admin User",
              email: "admin@example.com",
              role: "ADMIN",
            }
          }

          if (credentials.email === "staff@example.com" && credentials.password === "staff123") {
            console.log("Using hardcoded staff credentials")
            return {
              id: "staff-id",
              name: "Staff User",
              email: "staff@example.com",
              role: "STAFF",
            }
          }

          // Try database lookup if hardcoded credentials don't match
          console.log("Looking up user in database:", credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user.hashedPassword) {
            console.log("User not found or no password")
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.hashedPassword)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("User authenticated successfully:", user.email)
          return {
            id: user.id,
            name: user.name || "User",
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
  debug: true, // Enable debug mode to see more logs
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
