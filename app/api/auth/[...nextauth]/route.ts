import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"

// Define hardcoded users for testing
const users = [
  {
    id: "admin-user-id",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$GQH.xI9oCY6aYB4OMOVVXOLXCjL7KO9nFAEMxukdcXMkiMWiRHvMi", // admin123
    role: "ADMIN",
  },
  {
    id: "staff-user-id",
    name: "Staff User",
    email: "staff@example.com",
    password: "$2a$10$zGQ/4o0h0v0VC5.YV/KYVeRwJpOYccm9bd/1n8lfKyy0NLgQkFGlS", // staff123
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

        const user = users.find((user) => user.email === credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await bcryptjs.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

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
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
