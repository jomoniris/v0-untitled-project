import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Hardcoded users for testing - in a real app, these would come from a database
const users = [
  {
    id: "admin-id",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    role: "ADMIN",
  },
  {
    id: "staff-id",
    name: "Staff User",
    email: "staff@example.com",
    password: "staff123", // In a real app, this would be hashed
    role: "STAFF",
  },
]

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
          return null
        }

        // Find user by email
        const user = users.find((user) => user.email === credentials.email)
        if (!user) {
          return null
        }

        // Check password (in a real app, you would compare hashed passwords)
        if (user.password !== credentials.password) {
          return null
        }

        // Return user without password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
