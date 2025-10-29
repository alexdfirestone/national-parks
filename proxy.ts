import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // No logic yet — simply continue the request

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/parks', request.url))
  }
  return NextResponse.next()
}


// Optional: specify which routes this middleware applies to
export const config = {
  matcher: ['/'], // or remove entirely to apply to all routes
}