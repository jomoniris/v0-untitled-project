import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Role } from "@prisma/client"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  return session.user
}

export function unauthorized() {
  return new NextResponse(
    JSON.stringify({
      status: "error",
      message: "Unauthorized",
    }),
    { status: 401 },
  )
}

export function forbidden() {
  return new NextResponse(
    JSON.stringify({
      status: "error",
      message: "Forbidden",
    }),
    { status: 403 },
  )
}

export function notFound() {
  return new NextResponse(
    JSON.stringify({
      status: "error",
      message: "Not found",
    }),
    { status: 404 },
  )
}

export function badRequest(message = "Bad request") {
  return new NextResponse(
    JSON.stringify({
      status: "error",
      message,
    }),
    { status: 400 },
  )
}

export function serverError(error: any) {
  console.error(error)
  return new NextResponse(
    JSON.stringify({
      status: "error",
      message: "Internal server error",
    }),
    { status: 500 },
  )
}

export async function checkPermission(allowedRoles: Role[]) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return allowedRoles.includes(user.role as Role)
}
