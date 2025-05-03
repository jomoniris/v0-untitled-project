import type React from "react"
import { NextAuthProvider } from "@/components/providers/session-provider"
import { SessionDebug } from "@/components/session-debug"
import "./globals.css"

export const metadata = {
  title: "Car Rental Admin",
  description: "Admin dashboard for car rental management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
          <SessionDebug />
        </NextAuthProvider>
      </body>
    </html>
  )
}
