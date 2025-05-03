import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simplified auth options without database dependencies for initial setup
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "a-very-secure-secret-that-should-be-changed",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hardcoded admin user for testing
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin123") {
          return {
            id: "admin-user-id",
            name: "Admin User",
            email: "admin@example.com",
            role: "ADMIN",
          }
        }

        // Hardcoded staff user for testing
        if (credentials?.email === "staff@example.com" && credentials?.password === "staff123") {
          return {
            id: "staff-user-id",
            name: "Staff User",
            email: "staff@example.com",
            role: "STAFF",
          }
        }

        return null
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
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
