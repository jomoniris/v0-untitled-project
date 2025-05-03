import type React from "react"
import "./globals.css"
import { NextAuthProvider } from "@/components/providers/session-provider"

export const metadata = {
  title: "Car Rental Admin",
  description: "Admin panel for car rental management",
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
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
