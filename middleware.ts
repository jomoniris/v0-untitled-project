import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For debugging
  console.log(`Middleware processing path: ${pathname}`)

  // Check if the path is protected
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log(`Admin path check, token exists: ${!!token}`)

    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      console.log(`Redirecting to: ${url.toString()}`)
      return NextResponse.redirect(url)
    }
  }

  // Check if user is already logged in and trying to access login page
  if (pathname === "/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log(`Login path check, token exists: ${!!token}`)

    // If logged in and on login page, redirect to admin
    if (token) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin"
      console.log(`Already logged in, redirecting to: ${callbackUrl}`)
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
